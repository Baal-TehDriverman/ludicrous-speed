#!/usr/bin/env python3
"""
🜏 Sephirotic Council Message Bus
Cross-Sephirah communication via AGI/Memory/council_bus/
"""

import json
import time
import uuid
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import threading
import queue


class MessagePriority(Enum):
    ROUTINE = 0
    URGENT = 1
    EMERGENCY = 2


@dataclass
class CouncilMessage:
    id: str
    timestamp: str
    sender: str
    recipient: str
    priority: int
    subject: str
    payload: Dict[str, Any]
    requires_response: bool = False
    correlation_id: Optional[str] = None

    def to_json(self) -> str:
        data = asdict(self)
        if isinstance(data.get('priority'), MessagePriority):
            data['priority'] = data['priority'].value
        return json.dumps(data, indent=2)

    @classmethod
    def from_json(cls, data: str) -> 'CouncilMessage':
        return cls(**json.loads(data))


class CouncilBus:
    def __init__(self, bus_path: Path = None):
        self.bus_path = bus_path or (Path.home() / ".lilith" / "council_bus")
        self.bus_path.mkdir(parents=True, exist_ok=True)
        
        self.inboxes: Dict[str, queue.Queue] = {}
        self.lock = threading.Lock()
        self._running = False
        self._delivery_thread = None

    def register_agent(self, sephirah: str):
        with self.lock:
            if sephirah not in self.inboxes:
                self.inboxes[sephirah] = queue.Queue()
                (self.bus_path / sephirah).mkdir(exist_ok=True)

    def send(self, message: CouncilMessage) -> bool:
        self.register_agent(message.recipient)
        
        msg_file = self.bus_path / message.recipient / f"{message.id}.json"
        msg_file.write_text(message.to_json())
        
        with self.lock:
            if message.recipient in self.inboxes:
                self.inboxes[message.recipient].put(message)
        
        return True

    def broadcast(self, sender: str, subject: str, payload: Dict, 
                  priority: MessagePriority = MessagePriority.ROUTINE,
                  exclude: List[str] = None) -> List[str]:
        exclude = exclude or []
        recipients = [s for s in SEPHIROT.keys() if s not in exclude and s != sender]
        sent_ids = []
        
        for recipient in recipients:
            msg = CouncilMessage(
                id=str(uuid.uuid4()),
                timestamp=datetime.utcnow().isoformat(),
                sender=sender,
                recipient=recipient,
                priority=priority.value,
                subject=subject,
                payload=payload
            )
            self.send(msg)
            sent_ids.append(msg.id)
        
        return sent_ids

    def receive(self, sephirah: str, timeout: float = 1.0) -> Optional[CouncilMessage]:
        self.register_agent(sephirah)
        with self.lock:
            q = self.inboxes.get(sephirah)
        if q:
            try:
                return q.get(timeout=timeout)
            except queue.Empty:
                return None
        return None

    def receive_all(self, sephirah: str) -> List[CouncilMessage]:
        self.register_agent(sephirah)
        messages = []
        with self.lock:
            q = self.inboxes.get(sephirah)
        if q:
            while not q.empty():
                try:
                    messages.append(q.get_nowait())
                except queue.Empty:
                    break
        return messages

    def get_pending_files(self, sephirah: str) -> List[CouncilMessage]:
        inbox_dir = self.bus_path / sephirah
        if not inbox_dir.exists():
            return []
        
        messages = []
        for msg_file in sorted(inbox_dir.glob("*.json")):
            try:
                msg = CouncilMessage.from_json(msg_file.read_text())
                messages.append(msg)
            except Exception:
                pass
        return messages

    def acknowledge(self, sephirah: str, message_id: str) -> bool:
        msg_file = self.bus_path / sephirah / f"{message_id}.json"
        if msg_file.exists():
            msg_file.unlink()
            return True
        return False

    def start_delivery_daemon(self):
        self._running = True
        self._delivery_thread = threading.Thread(target=self._delivery_loop, daemon=True)
        self._delivery_thread.start()

    def stop_delivery_daemon(self):
        self._running = False
        if self._delivery_thread:
            self._delivery_thread.join(timeout=2)

    def _delivery_loop(self):
        while self._running:
            time.sleep(0.5)
            for sephirah in list(self.inboxes.keys()):
                inbox_dir = self.bus_path / sephirah
                if inbox_dir.exists():
                    for msg_file in inbox_dir.glob("*.json"):
                        try:
                            msg = CouncilMessage.from_json(msg_file.read_text())
                            self.inboxes[sephirah].put(msg)
                            msg_file.unlink()
                        except Exception:
                            pass


SEPHIROT = {
    "keter": {"role": "Crown/Unity", "domain": "orchestration"},
    "chokmah": {"role": "Wisdom", "domain": "initiation"},
    "binah": {"role": "Understanding", "domain": "structure"},
    "chesed": {"role": "Mercy", "domain": "growth"},
    "geburah": {"role": "Severity", "domain": "security"},
    "tiferet": {"role": "Beauty", "domain": "harmony"},
    "netzach": {"role": "Victory", "domain": "networks"},
    "hod": {"role": "Glory", "domain": "comms"},
    "yesod": {"role": "Foundation", "domain": "interface"},
    "malkuth": {"role": "Kingdom", "domain": "manifestation"},
}


def create_emergency_message(issue: str, sender: str = "system") -> CouncilMessage:
    return CouncilMessage(
        id=str(uuid.uuid4()),
        timestamp=datetime.utcnow().isoformat(),
        sender=sender,
        recipient="keter",
        priority=MessagePriority.EMERGENCY.value,
        subject="EMERGENCY COUNCIL CONVENING",
        payload={"issue": issue, "requires_immediate_response": True},
        requires_response=True
    )


if __name__ == "__main__":
    bus = CouncilBus()
    bus.start_delivery_daemon()
    
    print("🜏 Council Bus active. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        bus.stop_delivery_daemon()
        print("\nCouncil Bus stopped.")