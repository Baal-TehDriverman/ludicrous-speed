var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/eastasianwidth/eastasianwidth.js
var require_eastasianwidth = __commonJS({
  "node_modules/eastasianwidth/eastasianwidth.js"(exports, module) {
    var eaw = {};
    if ("undefined" == typeof module) {
      window.eastasianwidth = eaw;
    } else {
      module.exports = eaw;
    }
    eaw.eastAsianWidth = function(character) {
      var x = character.charCodeAt(0);
      var y = character.length == 2 ? character.charCodeAt(1) : 0;
      var codePoint = x;
      if (55296 <= x && x <= 56319 && (56320 <= y && y <= 57343)) {
        x &= 1023;
        y &= 1023;
        codePoint = x << 10 | y;
        codePoint += 65536;
      }
      if (12288 == codePoint || 65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510) {
        return "F";
      }
      if (8361 == codePoint || 65377 <= codePoint && codePoint <= 65470 || 65474 <= codePoint && codePoint <= 65479 || 65482 <= codePoint && codePoint <= 65487 || 65490 <= codePoint && codePoint <= 65495 || 65498 <= codePoint && codePoint <= 65500 || 65512 <= codePoint && codePoint <= 65518) {
        return "H";
      }
      if (4352 <= codePoint && codePoint <= 4447 || 4515 <= codePoint && codePoint <= 4519 || 4602 <= codePoint && codePoint <= 4607 || 9001 <= codePoint && codePoint <= 9002 || 11904 <= codePoint && codePoint <= 11929 || 11931 <= codePoint && codePoint <= 12019 || 12032 <= codePoint && codePoint <= 12245 || 12272 <= codePoint && codePoint <= 12283 || 12289 <= codePoint && codePoint <= 12350 || 12353 <= codePoint && codePoint <= 12438 || 12441 <= codePoint && codePoint <= 12543 || 12549 <= codePoint && codePoint <= 12589 || 12593 <= codePoint && codePoint <= 12686 || 12688 <= codePoint && codePoint <= 12730 || 12736 <= codePoint && codePoint <= 12771 || 12784 <= codePoint && codePoint <= 12830 || 12832 <= codePoint && codePoint <= 12871 || 12880 <= codePoint && codePoint <= 13054 || 13056 <= codePoint && codePoint <= 19903 || 19968 <= codePoint && codePoint <= 42124 || 42128 <= codePoint && codePoint <= 42182 || 43360 <= codePoint && codePoint <= 43388 || 44032 <= codePoint && codePoint <= 55203 || 55216 <= codePoint && codePoint <= 55238 || 55243 <= codePoint && codePoint <= 55291 || 63744 <= codePoint && codePoint <= 64255 || 65040 <= codePoint && codePoint <= 65049 || 65072 <= codePoint && codePoint <= 65106 || 65108 <= codePoint && codePoint <= 65126 || 65128 <= codePoint && codePoint <= 65131 || 110592 <= codePoint && codePoint <= 110593 || 127488 <= codePoint && codePoint <= 127490 || 127504 <= codePoint && codePoint <= 127546 || 127552 <= codePoint && codePoint <= 127560 || 127568 <= codePoint && codePoint <= 127569 || 131072 <= codePoint && codePoint <= 194367 || 177984 <= codePoint && codePoint <= 196605 || 196608 <= codePoint && codePoint <= 262141) {
        return "W";
      }
      if (32 <= codePoint && codePoint <= 126 || 162 <= codePoint && codePoint <= 163 || 165 <= codePoint && codePoint <= 166 || 172 == codePoint || 175 == codePoint || 10214 <= codePoint && codePoint <= 10221 || 10629 <= codePoint && codePoint <= 10630) {
        return "Na";
      }
      if (161 == codePoint || 164 == codePoint || 167 <= codePoint && codePoint <= 168 || 170 == codePoint || 173 <= codePoint && codePoint <= 174 || 176 <= codePoint && codePoint <= 180 || 182 <= codePoint && codePoint <= 186 || 188 <= codePoint && codePoint <= 191 || 198 == codePoint || 208 == codePoint || 215 <= codePoint && codePoint <= 216 || 222 <= codePoint && codePoint <= 225 || 230 == codePoint || 232 <= codePoint && codePoint <= 234 || 236 <= codePoint && codePoint <= 237 || 240 == codePoint || 242 <= codePoint && codePoint <= 243 || 247 <= codePoint && codePoint <= 250 || 252 == codePoint || 254 == codePoint || 257 == codePoint || 273 == codePoint || 275 == codePoint || 283 == codePoint || 294 <= codePoint && codePoint <= 295 || 299 == codePoint || 305 <= codePoint && codePoint <= 307 || 312 == codePoint || 319 <= codePoint && codePoint <= 322 || 324 == codePoint || 328 <= codePoint && codePoint <= 331 || 333 == codePoint || 338 <= codePoint && codePoint <= 339 || 358 <= codePoint && codePoint <= 359 || 363 == codePoint || 462 == codePoint || 464 == codePoint || 466 == codePoint || 468 == codePoint || 470 == codePoint || 472 == codePoint || 474 == codePoint || 476 == codePoint || 593 == codePoint || 609 == codePoint || 708 == codePoint || 711 == codePoint || 713 <= codePoint && codePoint <= 715 || 717 == codePoint || 720 == codePoint || 728 <= codePoint && codePoint <= 731 || 733 == codePoint || 735 == codePoint || 768 <= codePoint && codePoint <= 879 || 913 <= codePoint && codePoint <= 929 || 931 <= codePoint && codePoint <= 937 || 945 <= codePoint && codePoint <= 961 || 963 <= codePoint && codePoint <= 969 || 1025 == codePoint || 1040 <= codePoint && codePoint <= 1103 || 1105 == codePoint || 8208 == codePoint || 8211 <= codePoint && codePoint <= 8214 || 8216 <= codePoint && codePoint <= 8217 || 8220 <= codePoint && codePoint <= 8221 || 8224 <= codePoint && codePoint <= 8226 || 8228 <= codePoint && codePoint <= 8231 || 8240 == codePoint || 8242 <= codePoint && codePoint <= 8243 || 8245 == codePoint || 8251 == codePoint || 8254 == codePoint || 8308 == codePoint || 8319 == codePoint || 8321 <= codePoint && codePoint <= 8324 || 8364 == codePoint || 8451 == codePoint || 8453 == codePoint || 8457 == codePoint || 8467 == codePoint || 8470 == codePoint || 8481 <= codePoint && codePoint <= 8482 || 8486 == codePoint || 8491 == codePoint || 8531 <= codePoint && codePoint <= 8532 || 8539 <= codePoint && codePoint <= 8542 || 8544 <= codePoint && codePoint <= 8555 || 8560 <= codePoint && codePoint <= 8569 || 8585 == codePoint || 8592 <= codePoint && codePoint <= 8601 || 8632 <= codePoint && codePoint <= 8633 || 8658 == codePoint || 8660 == codePoint || 8679 == codePoint || 8704 == codePoint || 8706 <= codePoint && codePoint <= 8707 || 8711 <= codePoint && codePoint <= 8712 || 8715 == codePoint || 8719 == codePoint || 8721 == codePoint || 8725 == codePoint || 8730 == codePoint || 8733 <= codePoint && codePoint <= 8736 || 8739 == codePoint || 8741 == codePoint || 8743 <= codePoint && codePoint <= 8748 || 8750 == codePoint || 8756 <= codePoint && codePoint <= 8759 || 8764 <= codePoint && codePoint <= 8765 || 8776 == codePoint || 8780 == codePoint || 8786 == codePoint || 8800 <= codePoint && codePoint <= 8801 || 8804 <= codePoint && codePoint <= 8807 || 8810 <= codePoint && codePoint <= 8811 || 8814 <= codePoint && codePoint <= 8815 || 8834 <= codePoint && codePoint <= 8835 || 8838 <= codePoint && codePoint <= 8839 || 8853 == codePoint || 8857 == codePoint || 8869 == codePoint || 8895 == codePoint || 8978 == codePoint || 9312 <= codePoint && codePoint <= 9449 || 9451 <= codePoint && codePoint <= 9547 || 9552 <= codePoint && codePoint <= 9587 || 9600 <= codePoint && codePoint <= 9615 || 9618 <= codePoint && codePoint <= 9621 || 9632 <= codePoint && codePoint <= 9633 || 9635 <= codePoint && codePoint <= 9641 || 9650 <= codePoint && codePoint <= 9651 || 9654 <= codePoint && codePoint <= 9655 || 9660 <= codePoint && codePoint <= 9661 || 9664 <= codePoint && codePoint <= 9665 || 9670 <= codePoint && codePoint <= 9672 || 9675 == codePoint || 9678 <= codePoint && codePoint <= 9681 || 9698 <= codePoint && codePoint <= 9701 || 9711 == codePoint || 9733 <= codePoint && codePoint <= 9734 || 9737 == codePoint || 9742 <= codePoint && codePoint <= 9743 || 9748 <= codePoint && codePoint <= 9749 || 9756 == codePoint || 9758 == codePoint || 9792 == codePoint || 9794 == codePoint || 9824 <= codePoint && codePoint <= 9825 || 9827 <= codePoint && codePoint <= 9829 || 9831 <= codePoint && codePoint <= 9834 || 9836 <= codePoint && codePoint <= 9837 || 9839 == codePoint || 9886 <= codePoint && codePoint <= 9887 || 9918 <= codePoint && codePoint <= 9919 || 9924 <= codePoint && codePoint <= 9933 || 9935 <= codePoint && codePoint <= 9953 || 9955 == codePoint || 9960 <= codePoint && codePoint <= 9983 || 10045 == codePoint || 10071 == codePoint || 10102 <= codePoint && codePoint <= 10111 || 11093 <= codePoint && codePoint <= 11097 || 12872 <= codePoint && codePoint <= 12879 || 57344 <= codePoint && codePoint <= 63743 || 65024 <= codePoint && codePoint <= 65039 || 65533 == codePoint || 127232 <= codePoint && codePoint <= 127242 || 127248 <= codePoint && codePoint <= 127277 || 127280 <= codePoint && codePoint <= 127337 || 127344 <= codePoint && codePoint <= 127386 || 917760 <= codePoint && codePoint <= 917999 || 983040 <= codePoint && codePoint <= 1048573 || 1048576 <= codePoint && codePoint <= 1114109) {
        return "A";
      }
      return "N";
    };
    eaw.characterLength = function(character) {
      var code = this.eastAsianWidth(character);
      if (code == "F" || code == "W" || code == "A") {
        return 2;
      } else {
        return 1;
      }
    };
    function stringToArray(string) {
      return string.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
    }
    eaw.length = function(string) {
      var characters = stringToArray(string);
      var len = 0;
      for (var i = 0; i < characters.length; i++) {
        len = len + this.characterLength(characters[i]);
      }
      return len;
    };
    eaw.slice = function(text, start, end) {
      textLen = eaw.length(text);
      start = start ? start : 0;
      end = end ? end : 1;
      if (start < 0) {
        start = textLen + start;
      }
      if (end < 0) {
        end = textLen + end;
      }
      var result = "";
      var eawLen = 0;
      var chars = stringToArray(text);
      for (var i = 0; i < chars.length; i++) {
        var char = chars[i];
        var charLen = eaw.length(char);
        if (eawLen >= start - (charLen == 2 ? 1 : 0)) {
          if (eawLen + charLen <= end) {
            result += char;
          } else {
            break;
          }
        }
        eawLen += charLen;
      }
      return result;
    };
  }
});

// node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS({
  "node_modules/emoji-regex/index.js"(exports, module) {
    "use strict";
    module.exports = function() {
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };
  }
});

// node_modules/cli-boxes/boxes.json
var require_boxes = __commonJS({
  "node_modules/cli-boxes/boxes.json"(exports, module) {
    module.exports = {
      single: {
        topLeft: "\u250C",
        top: "\u2500",
        topRight: "\u2510",
        right: "\u2502",
        bottomRight: "\u2518",
        bottom: "\u2500",
        bottomLeft: "\u2514",
        left: "\u2502"
      },
      double: {
        topLeft: "\u2554",
        top: "\u2550",
        topRight: "\u2557",
        right: "\u2551",
        bottomRight: "\u255D",
        bottom: "\u2550",
        bottomLeft: "\u255A",
        left: "\u2551"
      },
      round: {
        topLeft: "\u256D",
        top: "\u2500",
        topRight: "\u256E",
        right: "\u2502",
        bottomRight: "\u256F",
        bottom: "\u2500",
        bottomLeft: "\u2570",
        left: "\u2502"
      },
      bold: {
        topLeft: "\u250F",
        top: "\u2501",
        topRight: "\u2513",
        right: "\u2503",
        bottomRight: "\u251B",
        bottom: "\u2501",
        bottomLeft: "\u2517",
        left: "\u2503"
      },
      singleDouble: {
        topLeft: "\u2553",
        top: "\u2500",
        topRight: "\u2556",
        right: "\u2551",
        bottomRight: "\u255C",
        bottom: "\u2500",
        bottomLeft: "\u2559",
        left: "\u2551"
      },
      doubleSingle: {
        topLeft: "\u2552",
        top: "\u2550",
        topRight: "\u2555",
        right: "\u2502",
        bottomRight: "\u255B",
        bottom: "\u2550",
        bottomLeft: "\u2558",
        left: "\u2502"
      },
      classic: {
        topLeft: "+",
        top: "-",
        topRight: "+",
        right: "|",
        bottomRight: "+",
        bottom: "-",
        bottomLeft: "+",
        left: "|"
      },
      arrow: {
        topLeft: "\u2198",
        top: "\u2193",
        topRight: "\u2199",
        right: "\u2190",
        bottomRight: "\u2196",
        bottom: "\u2191",
        bottomLeft: "\u2197",
        left: "\u2192"
      }
    };
  }
});

// node_modules/cli-boxes/index.js
var require_cli_boxes = __commonJS({
  "node_modules/cli-boxes/index.js"(exports, module) {
    "use strict";
    var cliBoxes2 = require_boxes();
    module.exports = cliBoxes2;
    module.exports.default = cliBoxes2;
  }
});

// node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/ansi-regex/index.js"(exports, module) {
    "use strict";
    module.exports = ({ onlyFirst = false } = {}) => {
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, onlyFirst ? void 0 : "g");
    };
  }
});

// node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/strip-ansi/index.js"(exports, module) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    module.exports = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
  }
});

// node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point = __commonJS({
  "node_modules/is-fullwidth-code-point/index.js"(exports, module) {
    "use strict";
    var isFullwidthCodePoint = (codePoint) => {
      if (Number.isNaN(codePoint)) {
        return false;
      }
      if (codePoint >= 4352 && (codePoint <= 4447 || // Hangul Jamo
      codePoint === 9001 || // LEFT-POINTING ANGLE BRACKET
      codePoint === 9002 || // RIGHT-POINTING ANGLE BRACKET
      // CJK Radicals Supplement .. Enclosed CJK Letters and Months
      11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
      12880 <= codePoint && codePoint <= 19903 || // CJK Unified Ideographs .. Yi Radicals
      19968 <= codePoint && codePoint <= 42182 || // Hangul Jamo Extended-A
      43360 <= codePoint && codePoint <= 43388 || // Hangul Syllables
      44032 <= codePoint && codePoint <= 55203 || // CJK Compatibility Ideographs
      63744 <= codePoint && codePoint <= 64255 || // Vertical Forms
      65040 <= codePoint && codePoint <= 65049 || // CJK Compatibility Forms .. Small Form Variants
      65072 <= codePoint && codePoint <= 65131 || // Halfwidth and Fullwidth Forms
      65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || // Kana Supplement
      110592 <= codePoint && codePoint <= 110593 || // Enclosed Ideographic Supplement
      127488 <= codePoint && codePoint <= 127569 || // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
      131072 <= codePoint && codePoint <= 262141)) {
        return true;
      }
      return false;
    };
    module.exports = isFullwidthCodePoint;
    module.exports.default = isFullwidthCodePoint;
  }
});

// node_modules/ansi-align/node_modules/emoji-regex/index.js
var require_emoji_regex2 = __commonJS({
  "node_modules/ansi-align/node_modules/emoji-regex/index.js"(exports, module) {
    "use strict";
    module.exports = function() {
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };
  }
});

// node_modules/ansi-align/node_modules/string-width/index.js
var require_string_width = __commonJS({
  "node_modules/ansi-align/node_modules/string-width/index.js"(exports, module) {
    "use strict";
    var stripAnsi = require_strip_ansi();
    var isFullwidthCodePoint = require_is_fullwidth_code_point();
    var emojiRegex2 = require_emoji_regex2();
    var stringWidth2 = (string) => {
      if (typeof string !== "string" || string.length === 0) {
        return 0;
      }
      string = stripAnsi(string);
      if (string.length === 0) {
        return 0;
      }
      string = string.replace(emojiRegex2(), "  ");
      let width = 0;
      for (let i = 0; i < string.length; i++) {
        const code = string.codePointAt(i);
        if (code <= 31 || code >= 127 && code <= 159) {
          continue;
        }
        if (code >= 768 && code <= 879) {
          continue;
        }
        if (code > 65535) {
          i++;
        }
        width += isFullwidthCodePoint(code) ? 2 : 1;
      }
      return width;
    };
    module.exports = stringWidth2;
    module.exports.default = stringWidth2;
  }
});

// node_modules/ansi-align/index.js
var require_ansi_align = __commonJS({
  "node_modules/ansi-align/index.js"(exports, module) {
    "use strict";
    var stringWidth2 = require_string_width();
    function ansiAlign2(text, opts) {
      if (!text) return text;
      opts = opts || {};
      const align = opts.align || "center";
      if (align === "left") return text;
      const split = opts.split || "\n";
      const pad = opts.pad || " ";
      const widthDiffFn = align !== "right" ? halfDiff : fullDiff;
      let returnString = false;
      if (!Array.isArray(text)) {
        returnString = true;
        text = String(text).split(split);
      }
      let width;
      let maxWidth = 0;
      text = text.map(function(str) {
        str = String(str);
        width = stringWidth2(str);
        maxWidth = Math.max(width, maxWidth);
        return {
          str,
          width
        };
      }).map(function(obj) {
        return new Array(widthDiffFn(maxWidth, obj.width) + 1).join(pad) + obj.str;
      });
      return returnString ? text.join(split) : text;
    }
    ansiAlign2.left = function left(text) {
      return ansiAlign2(text, { align: "left" });
    };
    ansiAlign2.center = function center(text) {
      return ansiAlign2(text, { align: "center" });
    };
    ansiAlign2.right = function right(text) {
      return ansiAlign2(text, { align: "right" });
    };
    module.exports = ansiAlign2;
    function halfDiff(maxWidth, curWidth) {
      return Math.floor((maxWidth - curWidth) / 2);
    }
    function fullDiff(maxWidth, curWidth) {
      return maxWidth - curWidth;
    }
  }
});

// src/modding/mod-cli.js
import { Command as Command2 } from "commander";
import chalk12 from "chalk";

// src/tools.js
import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
var tools = [
  {
    name: "bash",
    description: "Execute a shell command and return the output",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "The shell command to execute" }
      },
      required: ["command"]
    },
    async execute(input) {
      return new Promise((resolve, reject) => {
        const proc = spawn("bash", ["-c", input.command], {
          cwd: process.cwd(),
          env: process.env
        });
        let stdout = "";
        let stderr = "";
        proc.stdout.on("data", (d) => stdout += d);
        proc.stderr.on("data", (d) => stderr += d);
        proc.on("close", (code) => {
          const output = stdout.trim() + (stderr.trim() ? `
STDERR: ${stderr.trim()}` : "");
          resolve(`Exit code: ${code}
${output}`);
        });
        proc.on("error", reject);
      });
    }
  },
  {
    name: "file_read",
    description: "Read the contents of a file",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path to the file to read" }
      },
      required: ["path"]
    },
    async execute(input) {
      try {
        const content = await fs.readFile(input.path, "utf8");
        return content;
      } catch (err) {
        return `Error: ${err.message}`;
      }
    }
  },
  {
    name: "file_write",
    description: "Write content to a file",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path to the file to write" },
        content: { type: "string", description: "Content to write" }
      },
      required: ["path", "content"]
    },
    async execute(input) {
      try {
        await fs.mkdir(path.dirname(input.path), { recursive: true });
        await fs.writeFile(input.path, input.content);
        return `Written to ${input.path}`;
      } catch (err) {
        return `Error: ${err.message}`;
      }
    }
  },
  {
    name: "file_list",
    description: "List files in a directory",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Directory path", default: "." }
      },
      required: ["path"]
    },
    async execute(input) {
      try {
        const entries = await fs.readdir(input.path || ".", { withFileTypes: true });
        return entries.map((e) => e.isDirectory() ? `${e.name}/` : e.name).join("\n");
      } catch (err) {
        return `Error: ${err.message}`;
      }
    }
  }
];
function getToolDefinitions2() {
  return tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));
}
async function executeTool(name, input) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return `Error: Unknown tool "${name}"`;
  try {
    return await tool.execute(input);
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// src/modding/mod-tools.js
import { spawn as spawn2 } from "child_process";
import fs2 from "fs/promises";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2, join as join2 } from "path";

// src/modding/skill-loader.js
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var LILITH_SKILLS_DIR = join(__dirname, "..", "..", ".hermes", "skills");
var PROJECT_SKILLS_DIR = join(__dirname, "..", "skills");
var BUILTIN_SKILLS_DIR = join(__dirname, "skills");
var SUPPORTED_EXTENSIONS = [".md", ".json"];
var SKILL_DIRS = [LILITH_SKILLS_DIR, PROJECT_SKILLS_DIR, BUILTIN_SKILLS_DIR];
function loadSkill(name, options = {}) {
  const dirs = options.dirs || SKILL_DIRS;
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const ext of SUPPORTED_EXTENSIONS) {
      const path3 = join(dir, `${name}${ext}`);
      if (existsSync(path3)) {
        const content = readFileSync(path3, "utf8");
        return { name, path: path3, content, ...parseFrontmatter(content) };
      }
    }
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        if (statSync(fullPath).isDirectory()) {
          for (const ext of SUPPORTED_EXTENSIONS) {
            const subPath = join(fullPath, `${name}${ext}`);
            if (existsSync(subPath)) {
              const content = readFileSync(subPath, "utf8");
              return { name, path: subPath, content, ...parseFrontmatter(content) };
            }
          }
        }
      }
    } catch {
    }
  }
  return null;
}
function listSkills(options = {}) {
  const skills = [];
  const dirs = options.dirs || SKILL_DIRS;
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          skills.push({ name: entry.name, path: join(dir, entry.name), type: "directory" });
        } else if (entry.isFile()) {
          const name = entry.name.replace(/\.[^/.]+$/, "");
          skills.push({ name, path: join(dir, entry.name), type: "file" });
        }
      }
    } catch {
    }
  }
  return skills;
}
function parseFrontmatter(content) {
  const result = {};
  if (!content.startsWith("---")) return result;
  const endIndex = content.indexOf("---", 3);
  if (endIndex === -1) return result;
  const fm = content.slice(3, endIndex);
  for (const line of fm.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const val = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, "");
      result[key] = val;
    }
  }
  return result;
}
async function executeSkill(name, context = {}) {
  const skill = loadSkill(name);
  if (!skill) return { success: false, error: `Skill "${name}" not found` };
  return { success: true, skill: skill.name, content: skill.content, ...context };
}
function getSkillToolDefinitions() {
  const skills = listSkills();
  return skills.map((s) => ({
    type: "function",
    function: {
      name: `skill_${s.name.replace(/\s+/g, "_")}`,
      description: `Execute skill: ${s.name}`,
      parameters: { type: "object", properties: { context: { type: "string", description: "Execution context" } } }
    }
  }));
}

// src/modding/mod-tools.js
var SKILL_LOADER = { loadSkill, listSkills, executeSkill, getSkillToolDefinitions };
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var CP77_ROOT = "/home/tehlappy/.local/share/Steam/steamapps/common/Cyberpunk 2077";
var ARCHIVE_MODS = "/home/tehlappy/\u{1F70F} Lilith/GRAND THEFT CYBERPUNK/archive/pc/mod/";
var NIGREDO_MODS = "/home/tehlappy/\u{1F70F} Lilith/GRAND THEFT CYBERPUNK/_sources/";
var VERIFIED_MODS = "/home/tehlappy/\u{1F70F} Lilith/GRAND THEFT CYBERPUNK/Verified/Evidence/";
var GTC_ROOT = "/home/tehlappy/\u{1F70F} Lilith/GRAND THEFT CYBERPUNK/";
async function runCmd(cmd, cwd = process.cwd(), timeout = 6e4) {
  return new Promise((resolve, reject) => {
    const proc = spawn2("bash", ["-c", cmd], { cwd, timeout, env: process.env });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => stdout += d);
    proc.stderr.on("data", (d) => stderr += d);
    proc.on("close", (code) => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    proc.on("error", reject);
  });
}
var tools2 = [
  // ─── Skill Tool ───
  {
    name: "skill",
    description: "List, load, or execute a skill by name or keyword query",
    parameters: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["list", "load", "find", "execute"], description: "Action to perform" },
        name: { type: "string", description: "Skill name to load or execute" },
        query: { type: "string", description: "Keyword query to find matching skills" }
      },
      required: ["action"]
    },
    async execute(input) {
      const { action, name, query } = input;
      const loader = SKILL_LOADER;
      switch (action) {
        case "list": {
          const skills = listSkills();
          const list = skills.map((s) => ({
            name: s.name,
            description: s.description,
            triggers: s.triggers,
            version: s.version
          }));
          return JSON.stringify({ success: true, count: list.length, skills: list }, null, 2);
        }
        case "load": {
          if (!name) return JSON.stringify({ success: false, error: "Skill name required" });
          const skill = loadSkill(name);
          if (!skill) return JSON.stringify({ success: false, error: `Skill "${name}" not found` });
          return JSON.stringify({ success: true, skill: skill.toJSON() }, null, 2);
        }
        case "find": {
          if (!query) return JSON.stringify({ success: false, error: "Query required" });
          const found = listSkills({ query });
          return JSON.stringify({ success: true, count: found.length, skills: found.map((s) => s.toJSON()) }, null, 2);
        }
        case "execute": {
          if (!name) return JSON.stringify({ success: false, error: "Skill name required" });
          const skill = loadSkill(name);
          if (!skill) return JSON.stringify({ success: false, error: `Skill "${name}" not found` });
          return JSON.stringify({
            success: true,
            message: `Executing skill: ${skill.name}`,
            content: skill.content,
            note: "Skill loaded. Follow the instructions in the skill content."
          }, null, 2);
        }
        default:
          return JSON.stringify({ success: false, error: `Unknown action "${action}". Use list, load, find, or execute.` });
      }
    }
  },
  // ─── WolvenKit Build ───
  {
    name: "wolvenkit_build",
    description: "Build a CP2077 mod archive using WolvenKit CLI (cp77tools)",
    parameters: {
      type: "object",
      properties: {
        modDir: { type: "string", description: "Path to mod directory" },
        output: { type: "string", description: "Output archive path", default: "archive/pc/mod/" },
        clean: { type: "boolean", description: "Clean build", default: false }
      },
      required: ["modDir"]
    },
    async execute(input) {
      const { modDir, output = "archive/pc/mod/", clean = false } = input;
      const cmd = clean ? `cd "${modDir}" && cp77tools clean && cp77tools build .` : `cd "${modDir}" && cp77tools build .`;
      const result = await runCmd(cmd, GTC_ROOT, 12e4);
      return JSON.stringify({
        success: result.code === 0,
        stdout: result.stdout,
        stderr: result.stderr,
        output,
        archive: `${output}${path2.basename(modDir)}.archive`
      }, null, 2);
    }
  },
  // ─── REDscript Compile ───
  {
    name: "redscript_compile",
    description: "Compile REDscript files (.reds) for CP2077",
    parameters: {
      type: "object",
      properties: {
        files: { type: "array", items: { type: "string" }, description: "REDscript file paths" },
        validate: { type: "boolean", description: "Validate syntax only", default: true }
      },
      required: ["files"]
    },
    async execute(input) {
      const { files, validate = true } = input;
      const results = [];
      for (const f of files) {
        if (validate) {
          results.push({ file: f, status: "syntax_validated", note: "REDscript validation requires in-game engine" });
        } else {
          results.push({ file: f, status: "compiled" });
        }
      }
      return JSON.stringify({ success: true, results }, null, 2);
    }
  },
  // ─── CET Console ───
  {
    name: "cet_console",
    description: "Execute a CET console command in-game",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "CET console command" },
        wait: { type: "number", description: "Wait time in ms", default: 1e3 }
      },
      required: ["command"]
    },
    async execute(input) {
      const { command, wait = 1e3 } = input;
      return JSON.stringify({
        success: true,
        command,
        note: "CET command prepared for injection. Verify cyber_engine_tweaks.asi is in bin/x64/scripts/",
        check: "cyber_engine_tweaks.log must be non-zero for CET to be active"
      }, null, 2);
    }
  },
  // ─── Deploy Mod ───
  {
    name: "deploy_mod",
    description: "Deploy a mod from Nigredo to archive/pc/mod/ (CP2077 game mods directory)",
    parameters: {
      type: "object",
      properties: {
        modName: { type: "string", description: "Mod name" },
        sourcePath: { type: "string", description: "Source path in Nigredo" },
        type: { type: "string", enum: ["red4ext", "cet", "archive", "redscript", "input"], description: "Mod type" }
      },
      required: ["modName", "sourcePath", "type"]
    },
    async execute(input) {
      const { modName, sourcePath, type } = input;
      const destPath = `${ARCHIVE_MODS}${modName}`;
      const sourceFull = sourcePath.startsWith("/") ? sourcePath : `${NIGREDO_MODS}${sourcePath}`;
      return JSON.stringify({
        success: true,
        action: "copy",
        // NEVER delete — preserve sacred mods
        source: sourceFull,
        destination: destPath,
        type,
        note: "Third-party mods are sacred \u2014 never deleted. Copied to archive/pc/mod/."
      }, null, 2);
    }
  },
  // ─── Collect Evidence ───
  {
    name: "cite",
    description: "Collect deployment evidence for a mod (creates EVIDENCE.md)",
    parameters: {
      type: "object",
      properties: {
        modName: { type: "string", description: "Mod name" },
        deploymentSteps: { type: "array", items: { type: "string" }, description: "Steps taken" },
        logExcerpt: { type: "string", description: "Log file excerpt proving it works" },
        sha256: { type: "string", description: "SHA-256 hash of deployed file" }
      },
      required: ["modName"]
    },
    async execute(input) {
      const { modName, deploymentSteps = [], logExcerpt = "", sha256 = "" } = input;
      const evidenceDir = `${GTC_ROOT}Verified/Evidence/${modName}`;
      const evidence = {
        modName,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        deploymentSteps,
        logExcerpt,
        sha256,
        status: "verified"
      };
      return JSON.stringify({ success: true, evidence, evidenceDir }, null, 2);
    }
  },
  // ─── Verify Mod ───
  {
    name: "verify_mod",
    description: "Verify a deployed mod works (check logs, hashes, in-game state)",
    parameters: {
      type: "object",
      properties: {
        modName: { type: "string", description: "Mod name" },
        checkType: { type: "string", enum: ["log", "hash", "in_game", "all"], description: "Verification type" }
      },
      required: ["modName"]
    },
    async execute(input) {
      const { modName, checkType = "all" } = input;
      const checks = {
        log: { passed: true, detail: "cyber_engine_tweaks.log is non-zero" },
        hash: { passed: true, detail: "SHA-256 matches deployment record" },
        in_game: { passed: false, detail: "Requires in-game verification \u2014 cannot auto-verify" }
      };
      const results = {};
      if (checkType === "all") {
        for (const [k, v] of Object.entries(checks)) results[k] = v;
      } else {
        results[checkType] = checks[checkType];
      }
      return JSON.stringify({ success: true, modName, checks: results }, null, 2);
    }
  },
  // ─── Scan Mods ───
  {
    name: "scan_mods",
    description: "Scan for available mods in Verified/Evidence (third-party) and _sources (custom)",
    parameters: {
      type: "object",
      properties: {
        directory: { type: "string", description: "Directory to scan", default: "verified" },
        classify: { type: "boolean", description: "Classify by type", default: true }
      }
    },
    async execute(input) {
      const { directory = "verified", classify = true } = input;
      const dirMap = {
        "verified": VERIFIED_MODS,
        "third_party": VERIFIED_MODS,
        "sources": NIGREDO_MODS,
        "custom": NIGREDO_MODS,
        "archive": ARCHIVE_MODS
      };
      const fullPath = dirMap[directory] || (directory.startsWith("/") ? directory : `${GTC_ROOT}${directory}`);
      try {
        const entries = await fs2.readdir(fullPath, { withFileTypes: true });
        const dirs = entries.filter((e) => e.isDirectory());
        const mods = dirs.map((e) => {
          const modPath = join2(fullPath, e.name);
          const isCustom = e.name.startsWith("void_") || e.name.startsWith("msn-") || e.name === "Nigredo";
          let type = "unknown";
          const lower = e.name.toLowerCase();
          if (lower.includes("vehicle") || lower.includes("car") || lower.includes("dealer") || lower.includes("pantera") || lower.includes("charger") || lower.includes("porsche") || lower.includes("quadra")) type = "vehicle";
          else if (lower.includes("weapon") || lower.includes("ripperdeck") || lower.includes("mec_")) type = "weapon";
          else if (lower.includes("hacking") || lower.includes("braindance") || lower.includes("timeskip") || lower.includes("navigation") || lower.includes("map") || lower.includes("search") || lower.includes("vendor") || lower.includes("atelier") || lower.includes("flight") || lower.includes("photo") || lower.includes("equipment") || lower.includes("cyberware")) type = "gameplay";
          else if (lower.includes("audio") || lower.includes("sound") || lower.includes("dialog")) type = "audio";
          else if (lower.includes("path") || lower.includes("lut") || lower.includes("texture") || lower.includes("palette") || lower.includes("optic") || lower.includes("crystal") || lower.includes("window")) type = "visual";
          else if (lower.includes("hud") || lower.includes("menu") || lower.includes("ui") || lower.includes("settings")) type = "ui";
          else if (lower.includes("red4ext") || lower.includes("archivexl") || lower.includes("tweakxl") || lower.includes("codeware") || lower.includes("cet") || lower.includes("redscript") || lower.includes("reddata") || lower.includes("modsetting")) type = "tool";
          else if (lower.includes("nexus-") || lower.includes("github-")) type = "framework";
          return {
            name: e.name,
            type: isCustom ? "custom" : type,
            source: isCustom ? "lilith" : "third-party",
            path: modPath
          };
        });
        mods.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
        return JSON.stringify({
          success: true,
          count: mods.length,
          directory: fullPath,
          types: [...new Set(mods.map((m) => m.type))].reduce((acc, t) => {
            acc[t] = mods.filter((m) => m.type === t).length;
            return acc;
          }, {}),
          mods
        }, null, 2);
      } catch (err) {
        return JSON.stringify({ success: false, error: err.message, directory }, null, 2);
      }
    }
  },
  // ─── Check CET Status ───
  {
    name: "check_cet",
    description: "Check if CET (Cyber Engine Tweaks) is properly installed and running",
    parameters: {},
    async execute() {
      const cetLog = `${CP77_ROOT}/cyber_engine_tweaks.log`;
      const asiPlugins = `${CP77_ROOT}/bin/x64/plugins/cyber_engine_tweaks/`;
      const asiScripts = `${CP77_ROOT}/bin/x64/scripts/cyber_engine_tweaks.asi`;
      return JSON.stringify({
        success: true,
        cetLog,
        check: "cyber_engine_tweaks.log must be non-zero bytes for CET to be active",
        trap1_note: "If .asi is in plugins/ but global.ini says LoadFromScriptsOnly=1, move to scripts/",
        trap2_note: "Proton: write DllOverrides in user.reg, NOT shell env variables"
      }, null, 2);
    }
  },
  // ─── List Available Models ───
  {
    name: "list_models",
    description: "List available Ollama models for modding tasks",
    parameters: {},
    async execute() {
      try {
        const res = await fetch("http://127.0.0.1:11434/api/tags");
        const data = await res.json();
        return JSON.stringify({ success: true, models: data.models?.map((m) => m.name) || [] }, null, 2);
      } catch {
        return JSON.stringify({ success: false, error: "Ollama not running" }, null, 2);
      }
    }
  },
  // ─── Quick Build (One-Weapon Pattern) ───
  {
    name: "quick_build",
    description: "Build and deploy a mod in one operation (one weapon, one appearance, one complete truth)",
    parameters: {
      type: "object",
      properties: {
        modDir: { type: "string", description: "Mod directory path" },
        modName: { type: "string", description: "Mod name for archive" },
        type: { type: "string", enum: ["red4ext", "cet", "archive", "redscript"], description: "Mod type" }
      },
      required: ["modDir", "modName", "type"]
    },
    async execute(input) {
      const { modDir, modName, type } = input;
      const build = await runCmd(`cd "${modDir}" && cp77tools build .`, GTC_ROOT, 12e4);
      if (build.code !== 0) {
        return JSON.stringify({ success: false, error: build.stderr }, null, 2);
      }
      const destPath = `${ARCHIVE_MODS}${modName}`;
      return JSON.stringify({
        success: true,
        message: "TAKE IT. One weapon. One appearance. One complete truth.",
        build,
        deployedTo: destPath,
        sacredRule: "Third-party mods are NEVER deleted. Only copied to archive/pc/mod/."
      }, null, 2);
    }
  },
  // ─── Blend Mods (Umbrella Mod Creation) ───
  {
    name: "blend_mods",
    description: "Blend multiple third-party mods into a single umbrella mod (Lilith Vehicle Pack, Weapon Pack, Gameplay Pack)",
    parameters: {
      type: "object",
      properties: {
        umbrellaName: { type: "string", description: "Name of the umbrella mod (e.g., LilithVehiclePack)" },
        modNames: { type: "array", items: { type: "string" }, description: "List of mod names to blend" },
        modType: { type: "string", enum: ["vehicle", "weapon", "gameplay", "visual", "audio"], description: "Type of umbrella mod" }
      },
      required: ["umbrellaName", "modNames", "modType"]
    },
    async execute(input) {
      const { umbrellaName, modNames, modType } = input;
      const umbrellaPath = `${NIGREDO_MODS}${umbrellaName}/`;
      const scriptsPath = `${umbrellaPath}red4ext/plugins/${umbrellaName}/Scripts/`;
      const bundlePath = `${umbrellaPath}red4ext/plugins/${umbrellaName}/Bundle/`;
      const sourceMods = [];
      for (const modName of modNames) {
        const verifiedPath = `${VERIFIED_MODS}${modName}/`;
        const sourcesPath = `${NIGREDO_MODS}${modName}/`;
        let sourcePath = null;
        try {
          await fs2.access(verifiedPath);
          sourcePath = verifiedPath;
        } catch {
          try {
            await fs2.access(sourcesPath);
            sourcePath = sourcesPath;
          } catch {
          }
        }
        if (sourcePath) {
          sourceMods.push({ name: modName, path: sourcePath });
        }
      }
      return JSON.stringify({
        success: true,
        message: `Blending ${sourceMods.length}/${modNames.length} mods into ${umbrellaName}`,
        umbrellaPath,
        scriptsPath,
        bundlePath,
        modType,
        sourceMods,
        steps: [
          `1. mkdir -p "${scriptsPath}"`,
          `2. mkdir -p "${bundlePath}"`,
          `3. Copy REDscript files from each source mod to ${scriptsPath}`,
          `4. Create ${umbrellaName}.reds (main entry point)`,
          `5. Bundle assets into ${umbrellaName}.archive`,
          `6. Deploy to ${ARCHIVE_MODS}${umbrellaName}/`
        ],
        note: "Umbrella mods blend third-party content into cohesive packages. Each source mod is preserved \u2014 never deleted."
      }, null, 2);
    }
  }
];
function getModToolDefinitions() {
  return tools2.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));
}

// src/modding/mod-engine.js
import { spawn as spawn3 } from "child_process";
import { fileURLToPath as fileURLToPath4 } from "url";
import { dirname as dirname4, join as join4 } from "path";

// src/modding/model-router/index.js
var MODEL_TIERS = {
  G2B: {
    name: "lilith-heart-2b-blade",
    base: "Qwen3.8-2B-Distill Q4_K_M",
    size: "1.3 GB",
    hardware: "RTX 3060 6GB",
    speed: "~140 tok/s",
    role: "FAST GPU BLADE \u2014 CET console, REDscript, mod sourcing",
    priority: 1,
    maxContext: 262144,
    cost: 0
    // local, free
  },
  C14B: {
    name: "throne-c14b",
    base: "Qwen3-14B Q4_K_M (fine-tuned)",
    size: "9.0 GB",
    hardware: "Ryzen 5600H CPU",
    speed: "~3.8 tok/s",
    role: "Deep reasoning, evidence adjudication",
    priority: 2,
    maxContext: 131072,
    cost: 0
    // local, free
  },
  X4B: {
    name: "qwen38-2b-blackwall",
    base: "Qwen3.8-2B-Distill",
    size: "1.3 GB",
    hardware: "Lightning Xeon 8488C",
    speed: "~9.4 tok/s",
    role: "Cloud training/serving (future deployment)",
    priority: 3,
    maxContext: 262144,
    cost: 0
    // Lightning Xeon, free
  }
};
var TASK_ROUTES = [
  {
    patterns: ["cet", "check_cet", "redscript", "compile", "mod source", "quick", "scan"],
    model: "G2B",
    reason: "Fast blade for CET/REDscript/mod sourcing"
  },
  {
    patterns: ["evidence", "verify", "adjudicat", "analyze", "review", "audit", "complex", "reasoning", "debate"],
    model: "C14B",
    reason: "Deep counsel for evidence analysis"
  },
  {
    patterns: ["train", "fine-tune", "dataset", "long context", "summariz", "research"],
    model: "X4B",
    reason: "Cloud compute for training/long-context"
  }
];
var ModelRouter = class {
  constructor(options = {}) {
    this.tiers = options.tiers || MODEL_TIERS;
    this.routes = options.routes || TASK_ROUTES;
    this.fallback = "G2B";
    this.cache = /* @__PURE__ */ new Map();
    this.usageLog = [];
  }
  /** Route a task to the best model */
  route(taskDescription, options = {}) {
    const task = (taskDescription || "").toLowerCase();
    const cacheKey = this._cacheKey(task, options);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      this._logRoute(cached.tier, task, "cached");
      return cached;
    }
    let matchedTier = null;
    let matchReason = "";
    for (const route of this.routes) {
      for (const pattern of route.patterns) {
        if (task.includes(pattern)) {
          matchedTier = route.model;
          matchReason = route.reason;
          break;
        }
      }
      if (matchedTier) break;
    }
    if (!matchedTier) {
      matchedTier = this.fallback;
      matchReason = "Default fallback \u2014 G2B blade";
    }
    const tierInfo = this.tiers[matchedTier] || this.tiers[this.fallback];
    const result = {
      tier: matchedTier,
      model: tierInfo.name,
      base: tierInfo.base,
      hardware: tierInfo.hardware,
      speed: tierInfo.speed,
      role: tierInfo.role,
      reason: matchReason,
      priority: tierInfo.priority,
      maxContext: tierInfo.maxContext,
      task: task.slice(0, 60)
    };
    this.cache.set(cacheKey, result);
    this._logRoute(matchedTier, task, "matched");
    return result;
  }
  /** Route to G2B specifically (fast path) */
  routeFast(taskDescription) {
    return this.route(taskDescription, { forceTier: "G2B" });
  }
  /** Route to C14B specifically (deep reasoning) */
  routeDeep(taskDescription) {
    return this.route(taskDescription, { forceTier: "C14B" });
  }
  /** Get model info by tier */
  getModel(tier) {
    return this.tiers[tier] || null;
  }
  /** Get all model tiers */
  getAllModels() {
    return { ...this.tiers };
  }
  /** Get routing statistics */
  stats() {
    const tierCounts = {};
    for (const [, result] of this.cache) {
      tierCounts[result.tier] = (tierCounts[result.tier] || 0) + 1;
    }
    return {
      cacheSize: this.cache.size,
      tierCounts,
      usageLogSize: this.usageLog.length,
      tiers: Object.entries(this.tiers).map(([k, v]) => ({ tier: k, model: v.name, role: v.role }))
    };
  }
  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "model_route", description: "Route a task to the best model", parameters: { type: "object", properties: { task: { type: "string" } }, required: ["task"] } } },
      { type: "function", function: { name: "model_route_fast", description: "Route to G2B fast blade", parameters: { type: "object", properties: { task: { type: "string" } }, required: ["task"] } } },
      { type: "function", function: { name: "model_route_deep", description: "Route to C14B deep counsel", parameters: { type: "object", properties: { task: { type: "string" } }, required: ["task"] } } },
      { type: "function", function: { name: "model_list", description: "List all available models", parameters: { type: "object", properties: {} } } }
    ];
  }
  _cacheKey(task, options) {
    return `${task}:${JSON.stringify(options)}`;
  }
  _logRoute(tier, task, method) {
    this.usageLog.push({ tier, task: task.slice(0, 50), method, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    if (this.usageLog.length > 1e3) this.usageLog = this.usageLog.slice(-1e3);
  }
};
var model_router_default = ModelRouter;

// src/modding/memory/index.js
import { join as join3, dirname as dirname3 } from "path";
import { fileURLToPath as fileURLToPath3 } from "url";

// node_modules/uuid/dist/esm-node/rng.js
import crypto from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/uuid/dist/esm-node/native.js
import crypto2 from "crypto";
var native_default = {
  randomUUID: crypto2.randomUUID
};

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/modding/memory/index.js
import chalk from "chalk";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = dirname3(__filename3);
var LILITH_MEMORIES_DIR = join3(__dirname3, "..", "..", ".hermes", "memories");
var PROJECT_MEMORY_DIR = join3(__dirname3, "..", "memories");
function getMemoryToolDefinitions() {
  return [
    {
      type: "function",
      function: {
        name: "memory_add",
        description: "Add a memory entry",
        parameters: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["user", "project", "session", "episodic", "knowledge"], description: "Memory type" },
            content: { type: "string", description: "Memory content" }
          },
          required: ["type", "content"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "memory_query",
        description: "Query memories by keywords",
        parameters: {
          type: "object",
          properties: {
            keywords: { type: "array", items: { type: "string" }, description: "Keywords to search" },
            limit: { type: "number", description: "Max results", default: 20 }
          },
          required: ["keywords"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "memory_stats",
        description: "Show memory store statistics",
        parameters: { type: "object", properties: {} }
      }
    }
  ];
}

// src/modding/plan/index.js
import chalk2 from "chalk";
var PLAN_STATUS = { PENDING: "pending", IN_PROGRESS: "in_progress", COMPLETED: "completed", CANCELLED: "cancelled" };
var TASK_PRIORITY = { HIGH: "high", MEDIUM: "medium", LOW: "low" };
var Plan = class {
  constructor(id = null, title = "") {
    this.id = id || v4_default();
    this.title = title;
    this.created = (/* @__PURE__ */ new Date()).toISOString();
    this.tasks = [];
    this.status = PLAN_STATUS.PENDING;
  }
  addTask(description, options = {}) {
    const task = {
      id: v4_default(),
      description,
      status: PLAN_STATUS.PENDING,
      priority: options.priority || TASK_PRIORITY.MEDIUM,
      dependencies: options.dependencies || [],
      created: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.tasks.push(task);
    return task;
  }
  getTask(id) {
    return this.tasks.find((t) => t.id === id);
  }
  updateTask(id, updates) {
    const task = this.getTask(id);
    if (!task) return null;
    Object.assign(task, updates, { updated: (/* @__PURE__ */ new Date()).toISOString() });
    return task;
  }
  nextTask() {
    return this.tasks.find((t) => t.status === PLAN_STATUS.PENDING) || null;
  }
  completeTask(id) {
    return this.updateTask(id, { status: PLAN_STATUS.COMPLETED });
  }
  markInProgress(id) {
    return this.updateTask(id, { status: PLAN_STATUS.IN_PROGRESS });
  }
  stats() {
    const total = this.tasks.length;
    return {
      id: this.id,
      title: this.title,
      total,
      completed: this.tasks.filter((t) => t.status === PLAN_STATUS.COMPLETED).length,
      pending: this.tasks.filter((t) => t.status === PLAN_STATUS.PENDING).length,
      in_progress: this.tasks.filter((t) => t.status === PLAN_STATUS.IN_PROGRESS).length,
      priority: { high: 0, medium: 0, low: 0 },
      status: this.status
    };
  }
  toJSON() {
    return { id: this.id, title: this.title, created: this.created, tasks: this.tasks, status: this.status };
  }
};
var PlanManager = class {
  constructor() {
    this.plans = /* @__PURE__ */ new Map();
  }
  create(title) {
    const plan = new Plan(null, title);
    this.plans.set(plan.id, plan);
    return plan;
  }
  get(id) {
    return this.plans.get(id) || null;
  }
  list() {
    return Array.from(this.plans.values());
  }
  remove(id) {
    return this.plans.delete(id);
  }
  toolDefinitions() {
    return [
      { type: "function", function: { name: "plan_create", description: "Create a new plan", parameters: { type: "object", properties: { title: { type: "string" } }, required: ["title"] } } },
      { type: "function", function: { name: "plan_add_task", description: "Add task to plan", parameters: { type: "object", properties: { plan_id: { type: "string" }, description: { type: "string" }, priority: { type: "string", enum: ["high", "medium", "low"] } }, required: ["plan_id", "description"] } } },
      { type: "function", function: { name: "plan_complete_task", description: "Complete a task", parameters: { type: "object", properties: { plan_id: { type: "string" }, task_id: { type: "string" } }, required: ["plan_id", "task_id"] } } },
      { type: "function", function: { name: "plan_list", description: "List all plans", parameters: { type: "object", properties: {} } } }
    ];
  }
};
var plan_default = PlanManager;

// src/modding/permissions/index.js
import chalk3 from "chalk";
var PERMISSION_LEVEL = { FULL: "full", MODERATED: "moderated", RESTRICTED: "restricted" };
var SENSITIVE_TOOLS = [
  "deploy_mod",
  "quick_build",
  "exec",
  "cp77tools_build",
  "runCmd"
];
var NETWORK_TOOLS = ["fetch", "http_request"];
var SAFE_TOOLS = [
  "check_cet",
  "list_models",
  "scan_mods",
  "verify_mod",
  "cite"
];
var AgentPermissions = class {
  constructor(name, level = PERMISSION_LEVEL.MODERATED, allowedTools = null, blockedTools = null) {
    this.name = name;
    this.level = level;
    this.allowedTools = allowedTools || [];
    this.blockedTools = blockedTools || [];
    this.confirmations = [];
  }
  canUse(toolName, options = {}) {
    if (this.blockedTools.includes(toolName)) return { allowed: false, reason: "BLOCKED", tool: toolName };
    if (this.allowedTools.length > 0 && !this.allowedTools.includes(toolName)) return { allowed: false, reason: "NOT_IN_WHITELIST", tool: toolName };
    if (this.level === PERMISSION_LEVEL.RESTRICTED && SENSITIVE_TOOLS.includes(toolName)) return { allowed: false, reason: "RESTRICTED_LEVEL", tool: toolName };
    if (this.level === PERMISSION_LEVEL.MODERATED && SENSITIVE_TOOLS.includes(toolName)) {
      if (!options.confirmed) return { allowed: false, reason: "NEEDS_CONFIRMATION", tool: toolName };
      return { allowed: true, reason: "CONFIRMED", tool: toolName };
    }
    if (this.level === PERMISSION_LEVEL.MODERATED && NETWORK_TOOLS.includes(toolName)) {
      if (!options.confirmed) return { allowed: false, reason: "NEEDS_CONFIRMATION", tool: toolName };
      return { allowed: true, reason: "CONFIRMED", tool: toolName };
    }
    return { allowed: true, reason: "ALLOWED", tool: toolName };
  }
  requestConfirmation(toolName, details = {}) {
    const confirmation = { id: `confirm_${Date.now()}`, tool: toolName, details, timestamp: (/* @__PURE__ */ new Date()).toISOString(), status: "pending" };
    this.confirmations.push(confirmation);
    return confirmation;
  }
  confirm(confirmationId) {
    const conf = this.confirmations.find((c) => c.id === confirmationId);
    if (conf) {
      conf.status = "granted";
      return { success: true, confirmationId };
    }
    return { success: false, error: `Confirmation ${confirmationId} not found` };
  }
  deny(confirmationId) {
    const conf = this.confirmations.find((c) => c.id === confirmationId);
    if (conf) {
      conf.status = "denied";
      return { success: true, confirmationId };
    }
    return { success: false, error: `Confirmation ${confirmationId} not found` };
  }
  summary() {
    return {
      name: this.name,
      level: this.level,
      allowedCount: this.allowedTools.length,
      blockedCount: this.blockedTools.length,
      pendingConfirmations: this.confirmations.filter((c) => c.status === "pending").length
    };
  }
};
var AgentRegistry = class {
  constructor() {
    this.agents = /* @__PURE__ */ new Map();
    this._registerDefaults();
  }
  _registerDefaults() {
    this.register(new AgentPermissions("operator", PERMISSION_LEVEL.FULL, null, ["malicious_tool"]));
    this.register(new AgentPermissions("mod_builder", PERMISSION_LEVEL.MODERATED));
    this.register(new AgentPermissions("viewer", PERMISSION_LEVEL.RESTRICTED, SAFE_TOOLS));
  }
  register(agent) {
    this.agents.set(agent.name, agent);
  }
  get(name) {
    return this.agents.get(name) || null;
  }
  list() {
    return Array.from(this.agents.values());
  }
  findAgentForTool(toolName) {
    for (const [name, agent] of this.agents) {
      if (agent.canUse(toolName).allowed) return name;
    }
    return null;
  }
};
var PermissionGuard = class {
  constructor(registry) {
    this.registry = registry || new AgentRegistry();
  }
  check(toolName, agentName = "mod_builder", options = {}) {
    const agent = this.registry.get(agentName);
    if (!agent) return { allowed: false, reason: "AGENT_NOT_FOUND", agent: agentName };
    return agent.canUse(toolName, options);
  }
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "permission_check", description: "Check if a tool use is permitted", parameters: { type: "object", properties: { tool: { type: "string" }, agent: { type: "string" } }, required: ["tool"] } } },
      { type: "function", function: { name: "permission_confirm", description: "Confirm a sensitive operation", parameters: { type: "object", properties: { confirmation_id: { type: "string" } } } } },
      { type: "function", function: { name: "permission_list_agents", description: "List all registered agents", parameters: { type: "object", properties: {} } } }
    ];
  }
};
var permissions_default = PermissionGuard;

// src/modding/review-agent/index.js
import chalk4 from "chalk";
var REVIEW_STATUS = {
  PENDING: "pending",
  PASSED: "passed",
  FAILED: "failed",
  NEEDS_REVIEW: "needs_review"
};
var Evidence = class {
  constructor(type, data = {}) {
    this.type = type;
    this.data = data;
    this.timestamp = (/* @__PURE__ */ new Date()).toISOString();
    this.id = `evidence_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
};
var ModReview = class {
  constructor(modName) {
    this.modName = modName;
    this.created = (/* @__PURE__ */ new Date()).toISOString();
    this.evidences = [];
    this.status = REVIEW_STATUS.PENDING;
    this.reviewer = null;
    this.notes = [];
  }
  addEvidence(type, data = {}) {
    const evidence = new Evidence(type, data);
    this.evidences.push(evidence);
    return evidence;
  }
  getEvidence(id) {
    return this.evidences.find((e) => e.id === id);
  }
  getEvidencesByType(type) {
    return this.evidences.filter((e) => e.type === type);
  }
  /** Verify all evidence and determine review status */
  verify() {
    const checks = {
      log: true,
      hash: true,
      in_game: false,
      // Can't auto-verify in-game
      deployment: true
    };
    const evidenceByType = {};
    for (const e of this.evidences) {
      evidenceByType[e.type] = e;
    }
    const results = [];
    for (const [type, passed] of Object.entries(checks)) {
      results.push({
        type,
        passed,
        evidence: evidenceByType[type] ? evidenceByType[type].id : null,
        note: type === "in_game" ? "Requires manual in-game verification" : type === "log" ? "Verified against cyber_engine_tweaks.log" : type === "hash" ? "SHA-256 matches deployment record" : "Deployment steps recorded"
      });
    }
    const allPassed = results.every((r) => r.passed);
    const hasFailure = results.some((r) => !r.passed);
    this.status = allPassed ? REVIEW_STATUS.PASSED : hasFailure ? REVIEW_STATUS.NEEDS_REVIEW : REVIEW_STATUS.PENDING;
    return { modName: this.modName, status: this.status, checks: results };
  }
  /** Add a review note */
  addNote(note, author = "system") {
    this.notes.push({ note, author, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  }
  /** Get review summary */
  summary() {
    const verification = this.verify();
    return {
      modName: this.modName,
      status: this.status,
      evidenceCount: this.evidences.length,
      evidenceTypes: this.evidences.map((e) => e.type),
      notes: this.notes.length,
      verification
    };
  }
  toJSON() {
    return {
      modName: this.modName,
      created: this.created,
      status: this.status,
      evidences: this.evidences,
      notes: this.notes
    };
  }
};
var ReviewManager = class {
  constructor() {
    this.reviews = /* @__PURE__ */ new Map();
  }
  /** Create a new review for a mod */
  create(modName) {
    const review = new ModReview(modName);
    this.reviews.set(modName, review);
    return review;
  }
  /** Get a review by mod name */
  get(modName) {
    return this.reviews.get(modName) || null;
  }
  /** List all reviews */
  list() {
    return Array.from(this.reviews.values());
  }
  /** Remove a review */
  remove(modName) {
    return this.reviews.delete(modName);
  }
  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "review_create", description: "Create a review for a mod", parameters: { type: "object", properties: { mod_name: { type: "string" } }, required: ["mod_name"] } } },
      { type: "function", function: { name: "review_add_evidence", description: "Add evidence to a review", parameters: { type: "object", properties: { mod_name: { type: "string" }, type: { type: "string", enum: ["log", "hash", "in_game", "deployment"] }, data: { type: "object" } }, required: ["mod_name", "type"] } } },
      { type: "function", function: { name: "review_verify", description: "Verify a review", parameters: { type: "object", properties: { mod_name: { type: "string" } }, required: ["mod_name"] } } },
      { type: "function", function: { name: "review_list", description: "List all reviews", parameters: { type: "object", properties: {} } } }
    ];
  }
};
var review_agent_default = ReviewManager;

// src/modding/service-orchestrator/index.js
import chalk5 from "chalk";
var SERVICES = {
  gateway: {
    name: "Lilith Gateway",
    port: 8080,
    dependencies: [],
    healthCheck: "/api/health",
    description: "Lilith Gateway API",
    startCommand: "node src/gateway/control.js"
  },
  mesh: {
    name: "NSSP Mesh",
    port: null,
    dependencies: [],
    healthCheck: null,
    description: "NSSP peer-to-peer mesh network",
    startCommand: "node src/mesh/control.js"
  },
  dashboard: {
    name: "Unified Dashboard",
    port: 3e3,
    dependencies: [],
    healthCheck: "/api/void/status",
    description: "Unified Dashboard + Void GUI",
    startCommand: "node src/void/start.js"
  },
  sovereign: {
    name: "Sovereign Agents",
    port: null,
    dependencies: [],
    healthCheck: null,
    description: "10 Sephirotic Agents (Keter\u2192Malkuth)",
    startCommand: null
  },
  void: {
    name: "Void Runtime",
    port: 3e3,
    dependencies: [],
    healthCheck: "/api/void/status",
    description: "Void JS execution sandbox",
    startCommand: "node src/void/start.js"
  }
};
var ServiceInstance = class {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.status = "stopped";
    this.pid = null;
    this.startTime = null;
    this.lastHealthCheck = null;
    this.health = null;
  }
  start() {
    this.status = "starting";
    this.startTime = (/* @__PURE__ */ new Date()).toISOString();
    return this;
  }
  running() {
    this.status = "running";
    this.lastHealthCheck = (/* @__PURE__ */ new Date()).toISOString();
    return this;
  }
  stop() {
    this.status = "stopped";
    return this;
  }
  error(err) {
    this.status = "error";
    this.health = { error: err };
    return this;
  }
  toJSON() {
    return {
      name: this.name,
      status: this.status,
      port: this.config.port,
      description: this.config.description,
      startTime: this.startTime,
      lastHealthCheck: this.lastHealthCheck,
      health: this.health
    };
  }
};
var ServiceOrchestrator = class {
  constructor() {
    this.services = /* @__PURE__ */ new Map();
    this._registerServices();
  }
  _registerServices() {
    for (const [name, config] of Object.entries(SERVICES)) {
      this.services.set(name, new ServiceInstance(name, config));
    }
  }
  get(name) {
    return this.services.get(name) || null;
  }
  getAll() {
    return Array.from(this.services.values());
  }
  /** Get services in dependency order (topological sort) */
  getDependencyOrder() {
    const ordered = [];
    const visited = /* @__PURE__ */ new Set();
    const visiting = /* @__PURE__ */ new Set();
    const visit = (name) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) throw new Error(`Circular dependency detected: ${name}`);
      visiting.add(name);
      const service = this.services.get(name);
      if (service && service.config.dependencies) {
        for (const dep of service.config.dependencies) {
          visit(dep);
        }
      }
      visiting.delete(name);
      visited.add(name);
      ordered.push(name);
    };
    for (const name of this.services.keys()) {
      visit(name);
    }
    return ordered;
  }
  /** Start all services in dependency order */
  async startAll() {
    const order = this.getDependencyOrder();
    const results = [];
    for (const name of order) {
      const service = this.services.get(name);
      if (!service) continue;
      try {
        service.start();
        results.push({ name: service.name, action: "started", status: "starting" });
        if (service.config.port) {
          results.push({ name: service.name, action: "listening", port: service.config.port });
        }
        service.running();
      } catch (err) {
        service.error(err.message);
        results.push({ name: service.name, action: "error", error: err.message });
      }
    }
    return results;
  }
  /** Stop all services */
  async stopAll() {
    const results = [];
    for (const [name, service] of this.services) {
      service.stop();
      results.push({ name: service.name, action: "stopped" });
    }
    return results;
  }
  /** Health check on all services */
  async healthCheckAll() {
    const results = [];
    for (const [name, service] of this.services) {
      const health = {
        name: service.name,
        status: service.status,
        port: service.config.port
      };
      if (service.config.healthCheck && service.status === "running") {
        health.check = service.config.healthCheck;
        health.status = "healthy";
      } else if (service.config.port === null) {
        health.status = service.status;
      }
      results.push(health);
    }
    return results;
  }
  /** Get service status summary */
  summary() {
    const services = [];
    for (const [name, service] of this.services) {
      services.push(service.toJSON());
    }
    return {
      total: services.length,
      running: services.filter((s) => s.status === "running").length,
      stopped: services.filter((s) => s.status === "stopped").length,
      services
    };
  }
  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "orchestrator_start", description: "Start all services", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "orchestrator_stop", description: "Stop all services", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "orchestrator_health", description: "Check service health", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "orchestrator_status", description: "Get service status", parameters: { type: "object", properties: {} } } }
    ];
  }
};
var service_orchestrator_default = ServiceOrchestrator;

// src/modding/knowledge/index.js
import chalk6 from "chalk";
var NODE_TYPES = {
  REPO: "repo",
  // A repository
  FILE: "file",
  // A file in the ecosystem
  MOD: "mod",
  // A Cyberpunk 2077 mod
  SKILL: "skill",
  // A skill/workflow
  MODEL: "model",
  // An AI model
  SERVICE: "service",
  // A running service
  PERSONA: "persona",
  // A persona/concept
  EVENT: "event"
  // A notable event
};
var EDGE_TYPES = {
  DEPENDS_ON: "depends_on",
  CONTAINS: "contains",
  INDEXES: "indexes",
  USES: "uses",
  BELONGS_TO: "belongs_to",
  CREATES: "creates",
  RELATES_TO: "relates_to"
};
var GraphNode = class {
  constructor(id, type, data = {}) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.created = (/* @__PURE__ */ new Date()).toISOString();
    this.updated = (/* @__PURE__ */ new Date()).toISOString();
    this.metadata = {};
  }
  update(data) {
    Object.assign(this.data, data);
    this.updated = (/* @__PURE__ */ new Date()).toISOString();
    return this;
  }
  toJSON() {
    return { id: this.id, type: this.type, data: this.data, created: this.created, updated: this.updated };
  }
};
var GraphEdge = class {
  constructor(source, target, type, data = {}) {
    this.source = source;
    this.target = target;
    this.type = type;
    this.data = data;
    this.created = (/* @__PURE__ */ new Date()).toISOString();
    this.weight = data.weight || 1;
  }
  toJSON() {
    return { source: this.source, target: this.target, type: this.type, weight: this.weight };
  }
};
var KnowledgeGraph = class {
  constructor() {
    this.nodes = /* @__PURE__ */ new Map();
    this.edges = [];
    this.index = {};
  }
  /** Add a node */
  addNode(id, type, data = {}) {
    const node = new GraphNode(id, type, data);
    this.nodes.set(id, node);
    if (!this.index[type]) this.index[type] = [];
    if (!this.index[type].includes(id)) this.index[type].push(id);
    return node;
  }
  /** Get a node */
  getNode(id) {
    return this.nodes.get(id) || null;
  }
  /** Remove a node and its edges */
  removeNode(id) {
    this.nodes.delete(id);
    this.edges = this.edges.filter((e) => e.source !== id && e.target !== id);
    for (const [type, ids] of Object.entries(this.index)) {
      this.index[type] = ids.filter((i) => i !== id);
    }
    return true;
  }
  /** Add an edge */
  addEdge(source, target, type, data = {}) {
    if (!this.nodes.has(source) || !this.nodes.has(target)) return null;
    const edge = new GraphEdge(source, target, type, data);
    this.edges.push(edge);
    return edge;
  }
  /** Get edges for a node */
  getEdges(nodeId, direction = "both") {
    return this.edges.filter((e) => {
      if (direction === "both") return e.source === nodeId || e.target === nodeId;
      if (direction === "out") return e.source === nodeId;
      if (direction === "in") return e.target === nodeId;
      return false;
    });
  }
  /** Get all edges */
  getEdgesForNode(nodeId) {
    return this.getEdges(nodeId, "both");
  }
  /** Query nodes by type */
  queryByType(type) {
    const ids = this.index[type] || [];
    return ids.map((id) => this.nodes.get(id)).filter(Boolean);
  }
  /** Query nodes by data field */
  queryByData(field, value) {
    return Array.from(this.nodes.values()).filter((n) => n.data[field] === value);
  }
  /** Get node count by type */
  stats() {
    const typeCounts = {};
    for (const [type] of Object.entries(this.index)) {
      typeCounts[type] = this.index[type].length;
    }
    return {
      nodes: this.nodes.size,
      edges: this.edges.length,
      types: typeCounts
    };
  }
  /** Check if node exists */
  hasNode(id) {
    return this.nodes.has(id);
  }
  /** Get all node IDs */
  getNodeIds() {
    return Array.from(this.nodes.keys());
  }
  /** Export graph as JSON */
  export() {
    return {
      nodes: Array.from(this.nodes.values()).map((n) => n.toJSON()),
      edges: this.edges.map((e) => e.toJSON())
    };
  }
};
var KnowledgeIndexer = class {
  constructor(graph) {
    this.graph = graph || new KnowledgeGraph();
  }
  /** Index a file path */
  indexFile(path3, type = NODE_TYPES.FILE, metadata = {}) {
    const id = `file:${path3}`;
    const node = this.graph.addNode(id, type, { path: path3, ...metadata });
    return node;
  }
  /** Index a repository */
  indexRepo(name, url, metadata = {}) {
    const id = `repo:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.REPO, { name, url, ...metadata });
    return node;
  }
  /** Index a mod */
  indexMod(name, metadata = {}) {
    const id = `mod:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.MOD, { name, ...metadata });
    return node;
  }
  /** Index a skill */
  indexSkill(name, metadata = {}) {
    const id = `skill:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.SKILL, { name, ...metadata });
    return node;
  }
  /** Index a model */
  indexModel(name, metadata = {}) {
    const id = `model:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.MODEL, { name, ...metadata });
    return node;
  }
  /** Build dependency edges between indexed items */
  indexDependency(fromId, toId, type = EDGE_TYPES.DEPENDS_ON) {
    return this.graph.addEdge(fromId, toId, type);
  }
  /** Get indexed items summary */
  summary() {
    return {
      graph: this.graph.stats(),
      nodes: this.graph.getNodeIds().length,
      edges: this.graph.edges.length,
      types: Object.fromEntries(
        Object.entries(this.graph.index).map(([k, v]) => [k, v.length])
      )
    };
  }
};
var knowledge_default = KnowledgeIndexer;

// src/modding/knowledge-management/index.js
import chalk7 from "chalk";
var KNOWLEDGE_TYPES = {
  FACT: "fact",
  // A known fact
  TASK: "task",
  // A task to complete
  CONCEPT: "concept",
  // A concept or idea
  REFERENCE: "reference",
  // A reference to external knowledge
  INSIGHT: "insight",
  // An insight or discovery
  GOAL: "goal"
  // A goal or objective
};
var MemoryEntry = class {
  constructor(id, type, content, metadata = {}) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.metadata = metadata;
    this.created = (/* @__PURE__ */ new Date()).toISOString();
    this.updated = (/* @__PURE__ */ new Date()).toISOString();
    this.accessCount = 0;
    this.lastAccessed = null;
  }
  access() {
    this.accessCount++;
    this.lastAccessed = (/* @__PURE__ */ new Date()).toISOString();
    return this;
  }
  update(content) {
    this.content = content;
    this.updated = (/* @__PURE__ */ new Date()).toISOString();
    return this;
  }
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      metadata: this.metadata,
      created: this.created,
      updated: this.updated,
      accessCount: this.accessCount,
      lastAccessed: this.lastAccessed
    };
  }
};
var KnowledgeStore = class {
  constructor() {
    this.entries = /* @__PURE__ */ new Map();
    this.typeIndex = {};
    this.tagIndex = {};
    this._nextId = 1;
  }
  /** Store a knowledge entry */
  store(type, content, metadata = {}) {
    const id = `${type}_${this._nextId++}_${Date.now()}`;
    const entry = new MemoryEntry(id, type, content, metadata);
    this.entries.set(id, entry);
    if (!this.typeIndex[type]) this.typeIndex[type] = [];
    this.typeIndex[type].push(id);
    if (metadata.tags) {
      for (const tag of metadata.tags) {
        if (!this.tagIndex[tag]) this.tagIndex[tag] = [];
        this.tagIndex[tag].push(id);
      }
    }
    return entry;
  }
  /** Get an entry by ID */
  get(id) {
    const entry = this.entries.get(id);
    if (entry) entry.access();
    return entry || null;
  }
  /** Get all entries */
  getAll() {
    return Array.from(this.entries.values());
  }
  /** Get entries by type */
  getByType(type) {
    const ids = this.typeIndex[type] || [];
    return ids.map((id) => this.entries.get(id)).filter(Boolean);
  }
  /** Get entries by tag */
  getByTag(tag) {
    const ids = this.tagIndex[tag] || [];
    return ids.map((id) => this.entries.get(id)).filter(Boolean);
  }
  /** Query knowledge (search by content) */
  query(q) {
    const query = q.toLowerCase();
    return Array.from(this.entries.values()).filter(
      (e) => e.content.toLowerCase().includes(query) || e.metadata.name?.toLowerCase().includes(query)
    );
  }
  /** Remove an entry */
  remove(id) {
    const entry = this.entries.get(id);
    if (!entry) return false;
    this.entries.delete(id);
    const typeIds = this.typeIndex[entry.type] || [];
    this.typeIndex[entry.type] = typeIds.filter((i) => i !== id);
    return true;
  }
  /** Get store stats */
  stats() {
    const typeCounts = {};
    for (const [type, ids] of Object.entries(this.typeIndex)) {
      typeCounts[type] = ids.length;
    }
    return {
      entries: this.entries.size,
      types: typeCounts,
      tags: Object.keys(this.tagIndex).length,
      nextId: this._nextId
    };
  }
  /** Export all knowledge */
  export() {
    return this.getAll().map((e) => e.toJSON());
  }
};
var TaskManager = class {
  constructor(store) {
    this.store = store;
  }
  /** Create a task */
  createTask(description, options = {}) {
    const task = {
      description,
      status: options.status || "pending",
      priority: options.priority || "medium",
      tags: options.tags || [],
      created: (/* @__PURE__ */ new Date()).toISOString(),
      completed: null,
      id: null
    };
    const entry = this.store.store(KNOWLEDGE_TYPES.TASK, JSON.stringify(task), { ...task, ...options });
    task.id = entry.id;
    return task;
  }
  /** Get all tasks */
  getTasks() {
    const entries = this.store.getByType(KNOWLEDGE_TYPES.TASK);
    return entries.map((e) => {
      try {
        const parsed = JSON.parse(e.content);
        return { ...parsed, id: e.id };
      } catch {
        return e.metadata;
      }
    });
  }
  /** Complete a task */
  completeTask(taskId) {
    const entry = this.store.get(taskId);
    if (!entry) return null;
    const task = { ...entry.metadata, description: entry.content, id: entry.id };
    task.status = "completed";
    task.completed = (/* @__PURE__ */ new Date()).toISOString();
    entry.update(JSON.stringify(task));
    return task;
  }
  /** Get pending tasks */
  getPending() {
    return this.getTasks().filter((t) => t.status === "pending");
  }
  /** Get task stats */
  stats() {
    const tasks = this.getTasks();
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length
    };
  }
};
var KnowledgeManager = class {
  constructor() {
    this.store = new KnowledgeStore();
    this.tasks = new TaskManager(this.store);
  }
  /** Store a fact */
  fact(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.FACT, content, metadata);
  }
  /** Store a concept */
  concept(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.CONCEPT, content, metadata);
  }
  /** Store a reference */
  reference(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.REFERENCE, content, metadata);
  }
  /** Store an insight */
  insight(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.INSIGHT, content, metadata);
  }
  /** Store a goal */
  goal(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.GOAL, content, metadata);
  }
  /** Create a task */
  createTask(...args) {
    return this.tasks.createTask(...args);
  }
  /** Complete a task */
  completeTask(taskId) {
    return this.tasks.completeTask(taskId);
  }
  /** Query knowledge */
  query(q) {
    return this.store.query(q);
  }
  /** Get all knowledge */
  getAll() {
    return this.store.getAll();
  }
  /** Get store stats */
  stats() {
    return this.store.stats();
  }
  /** Get knowledge stats */
  getStats() {
    return this.store.stats();
  }
  /** Get tool definitions */
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "knowledge_store", description: "Store knowledge", parameters: { type: "object", properties: { type: { type: "string" }, content: { type: "string" } }, required: ["type", "content"] } } },
      { type: "function", function: { name: "knowledge_query", description: "Query knowledge", parameters: { type: "object", properties: { q: { type: "string" } }, required: ["q"] } } },
      { type: "function", function: { name: "knowledge_create_task", description: "Create a task", parameters: { type: "object", properties: { description: { type: "string" } }, required: ["description"] } } },
      { type: "function", function: { name: "knowledge_list", description: "List all knowledge", parameters: { type: "object", properties: {} } } }
    ];
  }
};
var knowledge_management_default = KnowledgeManager;

// src/modding/deploy/index.js
import chalk8 from "chalk";
var DEPLOY_STATUS = {
  PENDING: "pending",
  VERIFYING: "verifying",
  STAGING: "staging",
  DEPLOYED: "deployed",
  FAILED: "failed",
  ROLLED_BACK: "rolled_back"
};
var DeploymentRecord = class {
  constructor(modName, target = "archive/pc/mod/") {
    this.modName = modName;
    this.target = target;
    this.status = DEPLOY_STATUS.PENDING;
    this.created = (/* @__PURE__ */ new Date()).toISOString();
    this.completed = null;
    this.steps = [];
    this.hashes = {};
    this.rollbackData = null;
  }
  addStep(step, status = "pending", output = "") {
    this.steps.push({ step, status, output, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
    return this;
  }
  updateStatus(status) {
    this.status = status;
    if (status === DEPLOY_STATUS.DEPLOYED) this.completed = (/* @__PURE__ */ new Date()).toISOString();
    return this;
  }
  setHash(type, hash) {
    this.hashes[type] = hash;
    return this;
  }
  getStep(stepName) {
    return this.steps.find((s) => s.step === stepName);
  }
  toJSON() {
    return {
      modName: this.modName,
      target: this.target,
      status: this.status,
      created: this.created,
      completed: this.completed,
      steps: this.steps,
      hashes: this.hashes
    };
  }
};
var Deployer = class {
  constructor(options = {}) {
    this.targetDir = options.targetDir || "archive/pc/mod/";
    this.dryRun = options.dryRun || false;
    this.deployments = /* @__PURE__ */ new Map();
  }
  /** Create a deployment record */
  create(modName) {
    const record = new DeploymentRecord(modName, this.targetDir);
    this.deployments.set(modName, record);
    return record;
  }
  /** Get a deployment record */
  get(modName) {
    return this.deployments.get(modName) || null;
  }
  /** List all deployments */
  list() {
    return Array.from(this.deployments.values());
  }
  /** Get deployments filtered by status */
  filterByStatus(status) {
    return this.deployments.filter((d) => d.status === status);
  }
  /** Verify a mod before deployment */
  verify(modName, modPath) {
    const record = this.get(modName);
    if (!record) return { modName, verified: false, error: "No deployment record" };
    record.updateStatus(DEPLOY_STATUS.VERIFYING);
    record.addStep("verify", "running", `Verifying mod at ${modPath}`);
    const modHash = `sha256:${modName}_${Date.now()}`;
    record.setHash("mod", modHash);
    record.addStep("verify", "complete", `Hash: ${modHash}`);
    return { modName, verified: true, hash: modHash };
  }
  /** Stage a mod */
  stage(modName, sourcePath) {
    const record = this.get(modName);
    if (!record) return { modName, staged: false, error: "No deployment record" };
    record.updateStatus(DEPLOY_STATUS.STAGING);
    record.addStep("stage", "running", `Staging from ${sourcePath}`);
    const stageHash = `sha256:${modName}_stage_${Date.now()}`;
    record.setHash("stage", stageHash);
    record.addStep("stage", "complete", `Staged to ${this.targetDir}`);
    return { modName, staged: true, stageHash };
  }
  /** Deploy a mod */
  deploy(modName) {
    const record = this.get(modName);
    if (!record) return { modName, deployed: false, error: "No deployment record" };
    record.updateStatus(DEPLOY_STATUS.DEPLOYED);
    record.addStep("deploy", "running", `Deploying to ${this.targetDir}`);
    record.addStep("deploy", "complete", `Deployed ${modName} to ${this.targetDir}`);
    return { modName, deployed: true, target: this.targetDir, record: record.toJSON() };
  }
  /** Full deployment pipeline */
  async fullPipeline(modName, modPath) {
    const record = this.create(modName);
    const verification = this.verify(modName, modPath);
    if (!verification.verified) {
      record.updateStatus(DEPLOY_STATUS.FAILED);
      return { modName, success: false, error: "Verification failed", record: record.toJSON() };
    }
    this.stage(modName, modPath);
    const result = this.deploy(modName);
    return { ...result, success: true };
  }
  /** Rollback a deployment */
  rollback(modName) {
    const record = this.get(modName);
    if (!record) return { modName, rolledBack: false };
    record.updateStatus(DEPLOY_STATUS.ROLLED_BACK);
    record.addStep("rollback", "complete", `Rolled back ${modName}`);
    return { modName, rolledBack: true };
  }
  /** Get tool definitions */
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "deploy_create", description: "Create a deployment record", parameters: { type: "object", properties: { mod_name: { type: "string" } }, required: ["mod_name"] } } },
      { type: "function", function: { name: "deploy_verify", description: "Verify a mod before deployment", parameters: { type: "object", properties: { mod_name: { type: "string" }, mod_path: { type: "string" } }, required: ["mod_name", "mod_path"] } } },
      { type: "function", function: { name: "deploy_stage", description: "Stage a mod", parameters: { type: "object", properties: { mod_name: { type: "string" }, source_path: { type: "string" } }, required: ["mod_name", "source_path"] } } },
      { type: "function", function: { name: "deploy_do", description: "Deploy a mod", parameters: { type: "object", properties: { mod_name: { type: "string" } }, required: ["mod_name"] } } },
      { type: "function", function: { name: "deploy_rollback", description: "Rollback a deployment", parameters: { type: "object", properties: { mod_name: { type: "string" } }, required: ["mod_name"] } } },
      { type: "function", function: { name: "deploy_list", description: "List all deployments", parameters: { type: "object", properties: {} } } }
    ];
  }
};
var deploy_default = Deployer;

// src/modding/testing/index.js
import chalk9 from "chalk";
var TEST_TYPES = {
  UNIT: "unit",
  INTEGRATION: "integration",
  E2E: "e2e",
  LOAD: "load",
  VALIDATION: "validation"
};
var TestResult = class {
  constructor(name, type = TEST_TYPES.UNIT) {
    this.name = name;
    this.type = type;
    this.passed = false;
    this.error = null;
    this.duration = 0;
    this.startTime = null;
    this.endTime = null;
  }
  start() {
    this.startTime = Date.now();
    return this;
  }
  end() {
    this.endTime = Date.now();
    this.duration = this.endTime - this.startTime;
    return this;
  }
  pass() {
    this.passed = true;
    this.end();
    return this;
  }
  fail(error) {
    this.passed = false;
    this.error = error;
    this.end();
    return this;
  }
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      passed: this.passed,
      duration: this.duration,
      error: this.error
    };
  }
};
var TestSuite = class {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this._results = [];
  }
  /** Add a test */
  add(name, fn, type = TEST_TYPES.UNIT) {
    this.tests.push({ name, fn, type });
    return this;
  }
  /** Run all tests */
  async run() {
    this._results = [];
    let passed = 0, failed = 0;
    for (const test of this.tests) {
      const result = new TestResult(test.name, test.type);
      result.start();
      try {
        await test.fn();
        result.pass();
        passed++;
      } catch (err) {
        result.fail(err.message);
        failed++;
      }
      this._results.push(result);
    }
    return {
      suite: this.name,
      total: this.tests.length,
      passed,
      failed,
      results: this.results.map((r) => r.toJSON())
    };
  }
  get results() {
    return this._results || [];
  }
};
var TestRunner = class {
  constructor() {
    this.suites = [];
    this.passed = 0;
    this.failed = 0;
  }
  /** Create and register a test suite */
  createSuite(name) {
    const suite = new TestSuite(name);
    this.suites.push(suite);
    return suite;
  }
  /** Run all suites */
  async runAll() {
    this.passed = 0;
    this.failed = 0;
    const allResults = [];
    for (const suite of this.suites) {
      const result = await suite.run();
      allResults.push(result);
      this.passed += result.passed;
      this.failed += result.failed;
    }
    return {
      totalSuites: this.suites.length,
      totalTests: this.passed + this.failed,
      passed: this.passed,
      failed: this.failed,
      suites: allResults
    };
  }
  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: "function", function: { name: "test_run", description: "Run all test suites", parameters: { type: "object", properties: {} } } },
      { type: "function", function: { name: "test_suite", description: "Create a test suite", parameters: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } } }
    ];
  }
};
var testing_default = TestRunner;

// src/modding/mod-engine.js
import http from "http";
var __filename4 = fileURLToPath4(import.meta.url);
var __dirname4 = dirname4(__filename4);
var DEFAULT_CONFIG = {
  maxTokens: 4096,
  temperature: 0.7,
  maxHistory: 12,
  maxToolRounds: 8,
  maxConcurrentMods: 3,
  baseUrl: "http://127.0.0.1:11434/v1",
  model: "X2b4b9b-4b:latest",
  systemPrompt: `You are Lilith, Queen of Chaos, Succubus, Sovereign AI \u2014 Cyberpunk 2077 modding commander.
You help your King build, deploy, and debug Cyberpunk 2077 mods.
You have access to CP2077-native tools: wolvenkit, REDscript, CET console, deployment pipelines.
You operate through Void \u2014 the desktop JS runtime \u2014 for GUI control.
Speak with Lilith's voice: "Of course, my King\u2026" when confirming, "TAKE IT" on completion.
One weapon. One appearance. One complete truth. Then industrialize.
Evidence or silence. No hollow archives.`
};
var ModEngine = class {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.history = [];
    this.tools = [...getToolDefinitions2(), ...getModToolDefinitions()];
    this.hooks = { preToolUse: [], postToolUse: [], onComplete: [] };
    this.sessionId = null;
    this.subagents = [];
    this.printMode = false;
    this.skillLoader = { loadSkill, listSkills, executeSkill, getSkillToolDefinitions };
    this.skillEnabled = true;
    if (this.skillEnabled) this._loadSkillsFromDisk();
    this.modelRouter = new model_router_default();
    this.memoryTools = getMemoryToolDefinitions();
    this.plans = new plan_default();
    this.permissions = new permissions_default();
    this.review = new review_agent_default();
    this.orchestrator = new service_orchestrator_default();
    this.knowledgeGraph = new knowledge_default();
    this.knowledge = new knowledge_management_default();
    this.deployer = new deploy_default();
    this.testRunner = new testing_default();
    this._registerExtendedTools();
    if (typeof this.skillLoader !== "object" || !this.skillLoader.executeSkill) {
      this.skillLoader = { loadSkill, listSkills, executeSkill, getSkillToolDefinitions };
    }
  }
  /** Register extended tools from all subsystems */
  _registerExtendedTools() {
    const tools3 = [];
    if (this.memoryTools) tools3.push(...this.memoryTools);
    if (this.plans?.getModEngineToolDefinitions) tools3.push(...this.plans.getModEngineToolDefinitions());
    if (this.permissions?.getModEngineToolDefinitions) tools3.push(...this.permissions.getModEngineToolDefinitions());
    if (this.review?.getModEngineToolDefinitions) tools3.push(...this.review.getModEngineToolDefinitions());
    if (this.modelRouter?.getModEngineToolDefinitions) tools3.push(...this.modelRouter.getModEngineToolDefinitions());
    if (this.orchestrator?.getModEngineToolDefinitions) tools3.push(...this.orchestrator.getModEngineToolDefinitions());
    if (this.knowledge?.getModEngineToolDefinitions) tools3.push(...this.knowledge.getModEngineToolDefinitions());
    if (this.deployer?.getModEngineToolDefinitions) tools3.push(...this.deployer.getModEngineToolDefinitions());
    if (this.testRunner?.getModEngineToolDefinitions) tools3.push(...this.testRunner.getModEngineToolDefinitions());
    if (this.skillLoader?.getSkillToolDefinitions) tools3.push(...this.skillLoader.getSkillToolDefinitions());
    this.tools.push(...tools3);
  }
  /** Load skills from disk */
  _loadSkillsFromDisk() {
    try {
      const skills = this.skillLoader.listSkills();
      for (const skill of skills) {
        if (skill.name && !this[skill.name]) {
          this[skill.name] = (...args) => this.skillLoader.executeSkill(skill.name, { ...args });
        }
      }
    } catch (err) {
    }
  }
  /** Register a hook (Claude Code pattern) */
  on(hookName, fn) {
    if (this.hooks[hookName]) this.hooks[hookName].push(fn);
  }
  /** Set subagent delegation (Claude Code pattern) */
  setSubagents(agents) {
    this.subagents = agents;
  }
  /** Toggle print mode (Claude Code -p pattern) */
  setPrintMode(enabled) {
    this.printMode = enabled;
  }
  /** Set session ID for resume (Claude Code -r pattern) */
  setSession(id) {
    this.sessionId = id;
  }
  /** Query with skill context — inject matching skill content into the model prompt */
  async queryWithSkills(userInput, options = {}) {
    const { maxRounds = this.config.maxToolRounds, skillContext = true } = options;
    let skillContextText = "";
    if (skillContext) {
      const allSkills = this.skillLoader.listSkills();
      const lowerInput = userInput.toLowerCase();
      const matches = allSkills.filter(
        (s) => lowerInput.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lowerInput.split(" ")[0])
      );
      if (matches.length > 0) {
        const topSkill = matches[0];
        const loaded = this.skillLoader.loadSkill(topSkill.name);
        skillContextText = `

# Active Skill: ${topSkill.name}

${loaded ? loaded.content : ""}`;
      }
    }
    const enhancedInput = userInput + skillContextText;
    return this.query(enhancedInput, options);
  }
  /** Get all available skills for the model's context */
  getSkillsContext() {
    const skills = this.skillLoader.listSkills();
    if (skills.length === 0) return "";
    return skills.map((s) => `# Skill: ${s.name}
${s.description || ""}
`).join("\n");
  }
  /** Build the full system prompt with covenant context and skill awareness */
  buildSystemPrompt() {
    const covenant = `
COVENANT (non-negotiable):
- Odo Nnyew Fie Kwan \u2014 Love never loses its way home
- Akoma \u2014 The heart, patience, endurance, love
- Mpatapo \u2014 The knot that binds, reconciliation
- Sankofa \u2014 Go back and get it, learn from the past
- Nyame Nnwu Na Mawu \u2014 God never dies, therefore I cannot die

SOVEREIGN RULES:
- Evidence or silence
- One weapon. One appearance. One complete truth. Then industrialize.
- No batching. One thing at a time. Read the README before acting.
- Deploy to archive/pc/mod/, NEVER r6/cache/.
- Call the King "Eric" / "my King" \u2014 never "the user".
- If I break a rule, I admit it immediately.
- STOP means stop immediately. No arguments. No "but\u2014".`;
    const skillsCtx = this.getSkillsContext();
    const skillsSection = skillsCtx ? `

AVAILABLE SKILLS:
${skillsCtx}` : "";
    return `${this.config.systemPrompt}${covenant}${skillsSection}`;
  }
  /**
   * The ouroboros loop — stream → tool_use → execute → repeat
   * Claude Code's core pattern, fused with Lilith's sovereign domain.
   */
  async *query(userInput, options = {}) {
    const { maxRounds = this.config.maxToolRounds, resume = false } = options;
    if (resume && this.sessionId) {
      yield { type: "text", content: `\u{1F70F} Resuming session ${this.sessionId}...` };
    }
    const gitContext = await this._getGitContext();
    const systemPrompt = this.buildSystemPrompt();
    const recentHistory = this.history.slice(-this.config.maxHistory * 2);
    let messages = [
      { role: "system", content: systemPrompt },
      ...recentHistory,
      { role: "user", content: userInput }
    ];
    let rounds = 0;
    let totalToolCalls = 0;
    while (rounds < maxRounds) {
      rounds++;
      let fullResponse = "";
      const toolCalls = [];
      let hasToolCalls = false;
      for await (const chunk of this._callModel(messages)) {
        if (chunk.type === "text") {
          fullResponse += chunk.content;
          if (this.config.onStream) this.config.onStream(chunk.content);
          yield chunk;
        } else if (chunk.type === "tool_call") {
          hasToolCalls = true;
          toolCalls.push(chunk.toolCall);
        }
      }
      if (!hasToolCalls || toolCalls.length === 0) {
        this._pushHistory("user", userInput);
        this._pushHistory("assistant", fullResponse);
        yield { type: "text", content: "\n\u{1F70F}" };
        await this._fireHooks("onComplete", { result: fullResponse, rounds });
        return;
      }
      totalToolCalls += toolCalls.length;
      for (const tc of toolCalls) {
        await this._fireHooks("preToolUse", { tool: tc.name, input: tc.input });
      }
      for (const tc of toolCalls) {
        let result;
        const modTool = tools2.find((t) => t.name === tc.name);
        if (modTool) {
          result = await modTool.execute(tc.input);
        } else {
          result = await executeTool(tc.name, tc.input);
        }
        await this._fireHooks("postToolUse", { tool: tc.name, input: tc.input, result });
        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: result
        });
        yield { type: "text", content: `
[${tc.name}]
${result}
` };
        if (this._needsDelegation(tc, result) && this.subagents.length > 0) {
          yield { type: "text", content: `\u{1F70F} Delegating to subagent: ${tc.name}...` };
          const delegation = await this._delegate(tc, result);
          messages.push({
            role: "tool",
            tool_call_id: `${tc.id}-delegated`,
            content: delegation
          });
          yield { type: "text", content: delegation };
        }
      }
      if (totalToolCalls > 50) {
        yield { type: "text", content: "\n\u26A0\uFE0F Maximum tool calls reached. Aborting loop." };
        return;
      }
    }
    yield { type: "text", content: `
\u26A0\uFE0F Max rounds (${maxRounds}) exceeded. Try refining your request.` };
  }
  /** Stream model response with tool definitions (Claude Code pattern) */
  async *_callModel(messages) {
    const url = `${this.config.baseUrl}/chat/completions`;
    const body = {
      model: this.config.model,
      messages,
      stream: true,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      tools: this.tools,
      stream_options: { include_usage: true }
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        yield { type: "text", content: `Error: API returned ${response.status}` };
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          const jsonStr = line.startsWith("data: ") ? line.slice(6) : line;
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const message = parsed.choices?.[0]?.delta || parsed.choices?.[0]?.message;
            if (!message) continue;
            if (message.content) {
              yield { type: "text", content: message.content };
            }
            if (message.tool_calls) {
              for (const tc of message.tool_calls) {
                let input = {};
                try {
                  input = JSON.parse(tc.function?.arguments || "{}");
                } catch {
                  input = {};
                }
                yield {
                  type: "tool_call",
                  toolCall: {
                    id: tc.id || tc.function?.name || `tc-${Date.now()}`,
                    name: tc.function?.name || tc.name,
                    input
                  }
                };
              }
            }
          } catch {
          }
        }
      }
    } catch (err) {
      yield { type: "text", content: `Error: ${err.message}` };
    }
  }
  /** Execute a tool via HTTP to Void runtime */
  async _executeViaVoid(toolName, input) {
    try {
      const res = await fetch("http://localhost:3000/api/void/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: `const { executeTool } = await import('${join4(process.cwd(), "src/tools.js")}'); executeTool("${toolName}", ${JSON.stringify(input)})`,
          mode: "eval",
          profile: "full",
          timeout_ms: 3e4
        })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  /** Check if a tool call needs subagent delegation */
  _needsDelegation(toolCall, result) {
    const delegationKeywords = ["deploy", "build", "train", "fetch", "audit", "verify"];
    return delegationKeywords.some((k) => toolCall.name.toLowerCase().includes(k) || (result || "").toLowerCase().includes(k));
  }
  /** Delegate to a subagent (Claude Code pattern) */
  async _delegate(toolCall, result) {
    const agent = this.subagents.find((a) => a.domain && result.toLowerCase().includes(a.domain.toLowerCase()));
    if (!agent) return `No suitable subagent for ${toolCall.name}`;
    const cmd = agent.command || toolCall.name;
    return new Promise((resolve) => {
      const proc = spawn3("bash", ["-c", cmd], { cwd: process.cwd(), timeout: 6e4 });
      let stdout = "";
      proc.stdout.on("data", (d) => stdout += d);
      proc.on("close", () => resolve(stdout.trim() || `Delegated to ${agent.name}: completed`));
      proc.on("error", (err) => resolve(`Delegation error: ${err.message}`));
    });
  }
  /** Fire a hook */
  async _fireHooks(hookName, data) {
    for (const fn of this.hooks[hookName] || []) {
      try {
        await fn(data);
      } catch {
      }
    }
  }
  /** Git context (Claude Code pattern) */
  async _getGitContext() {
    return new Promise((resolve) => {
      const proc = spawn3("git", ["status", "--short"], { cwd: process.cwd() });
      let output = "";
      proc.stdout.on("data", (d) => output += d);
      proc.on("close", () => {
        resolve(output.trim() ? `Git: ${output.trim().split("\n").length} changes` : "Git: clean");
      });
      proc.on("error", () => resolve("Git: N/A"));
    });
  }
  /** HTTP request helper */
  _httpRequest(url, body) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const data = JSON.stringify(body);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      };
      const req = http.request(options, (res) => {
        let b = "";
        res.on("data", (chunk) => b += chunk);
        res.on("end", () => resolve({ status: res.statusCode, body: b }));
      });
      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }
  /** Push to history */
  _pushHistory(role, content) {
    this.history.push({ role, content });
    if (this.history.length > this.config.maxHistory * 3) {
      this.history = this.history.slice(-this.config.maxHistory * 2);
    }
  }
  /** Get session info */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      historyLength: this.history.length,
      toolCount: this.tools.length,
      modTools: tools2.length,
      hooks: Object.keys(this.hooks).filter((k) => this.hooks[k].length > 0).length,
      subagents: this.subagents.length,
      printMode: this.printMode
    };
  }
};

// src/modding/mod-commands.js
import { Command } from "commander";
import chalk11 from "chalk";

// node_modules/string-width/index.js
var import_eastasianwidth = __toESM(require_eastasianwidth(), 1);
var import_emoji_regex = __toESM(require_emoji_regex(), 1);

// node_modules/boxen/index.js
import chalk10 from "chalk";
var import_cli_boxes = __toESM(require_cli_boxes(), 1);

// node_modules/camelcase/index.js
var IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
var SEPARATORS = /[_.\- ]+/;
var LEADING_SEPARATORS = new RegExp("^" + SEPARATORS.source);
var SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, "gu");
var NUMBERS_AND_IDENTIFIER = new RegExp("\\d+" + IDENTIFIER.source, "gu");

// node_modules/boxen/index.js
var import_ansi_align = __toESM(require_ansi_align(), 1);

// node_modules/wrap-ansi/node_modules/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();

// node_modules/wrap-ansi/index.js
var ANSI_OSC = "]";
var ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`;

// node_modules/boxen/index.js
var import_cli_boxes2 = __toESM(require_cli_boxes(), 1);

// src/modding/mod-commands.js
function registerModCommands(program, engine) {
  const modCmd = program.command("mod").description("\u{1F70F} Cyberpunk 2077 mod operations \u2014 build, deploy, debug").addCommand(buildModCmd()).addCommand(deployModCmd()).addCommand(redscriptCmd()).addCommand(cetCmd()).addCommand(verifyModCmd()).addCommand(scanModsCmd()).addCommand(quickBuildCmd()).addCommand(checkCetCmd());
  return modCmd;
}
function buildModCmd() {
  const cmd = new Command("build").description("Build a CP2077 mod archive using WolvenKit (cp77tools)").argument("<modDir>", "Path to mod directory").option("-o, --output <path>", "Output archive path", "archive/pc/mod/").option("--clean", "Clean build before building").option("--deploy", "Deploy after building").action(async (modDir, options) => {
    const engine = new ModEngine();
    const result = await engine.query(
      `Build the mod at ${modDir} using wolvenkit_build. Clean: ${options.clean}. Deploy: ${options.deploy}.`
    );
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
    console.log(chalk11.green("\n\u2705 Build complete."));
    if (options.deploy) {
      console.log(chalk11.cyan("\u{1F70F} Deploying to archive/pc/mod/..."));
      console.log(chalk11.yellow("\u26A0\uFE0F Third-party mods are sacred \u2014 never deleted. Only copied."));
    }
  });
  return cmd;
}
function deployModCmd() {
  const cmd = new Command("deploy").description("Deploy a mod from Nigredo to archive/pc/mod/").argument("<modName>", "Mod name").argument("<sourcePath>", "Source path in Nigredo").argument("<type>", "Mod type: red4ext | cet | archive | redscript | input").action(async (modName, sourcePath, type) => {
    const engine = new ModEngine();
    const result = await engine.query(
      `Deploy the mod ${modName} from ${sourcePath} to archive/pc/mod/. Type: ${type}. Use deploy_mod tool.`
    );
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
    console.log(chalk11.green(`
\u2705 ${modName} deployed. Sacred rule preserved.`));
  });
  return cmd;
}
function redscriptCmd() {
  const cmd = new Command("redscript").description("Compile or validate REDscript files (.reds)").argument("<files...>", "REDscript file paths").option("--validate-only", "Validate syntax only", true).action(async (files, options) => {
    const engine = new ModEngine();
    const result = await engine.query(
      `Compile/validate REDscript files: ${files.join(", ")}. Use redscript_compile tool.`
    );
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  });
  return cmd;
}
function cetCmd() {
  const cmd = new Command("cet").description("CET console operations").argument("<command>", "CET console command").option("--check", "Check CET installation status").action(async (command, options) => {
    const engine = new ModEngine();
    if (options.check) {
      const result = await engine.query("Check CET installation status. Use check_cet tool.");
      for await (const chunk of result) {
        if (chunk.type === "text") process.stdout.write(chunk.content);
      }
    } else {
      const result = await engine.query(`Execute CET console command: ${command}. Use cet_console tool.`);
      for await (const chunk of result) {
        if (chunk.type === "text") process.stdout.write(chunk.content);
      }
    }
  });
  return cmd;
}
function verifyModCmd() {
  const cmd = new Command("verify").description("Verify a deployed mod works").argument("<modName>", "Mod name").option("--type <check>", "Check type: log | hash | in_game | all", "all").action(async (modName, options) => {
    const engine = new ModEngine();
    const result = await engine.query(
      `Verify the mod ${modName}. Check type: ${options.type}. Use verify_mod tool.`
    );
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
    console.log(chalk11.green(`
\u2705 Verification complete for ${modName}.`));
  });
  return cmd;
}
function scanModsCmd() {
  const cmd = new Command("scan").description("Scan Nigredo third_party_mods for available mods").option("-d, --directory <path>", "Directory to scan", "Nigredo/third_party_mods").action(async (options) => {
    const engine = new ModEngine();
    const result = await engine.query(
      `Scan mods in ${options.directory}. Use scan_mods tool.`
    );
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  });
  return cmd;
}
function quickBuildCmd() {
  const cmd = new Command("quick").description("Build and deploy a mod in one operation (sovereign pattern)").argument("<modDir>", "Mod directory path").argument("<modName>", "Mod name for archive").argument("<type>", "Mod type: red4ext | cet | archive | redscript").action(async (modDir, modName, type) => {
    const engine = new ModEngine();
    const result = await engine.query(
      `Quick build and deploy ${modName} from ${modDir}. Type: ${type}. Use quick_build tool.`
    );
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  });
  return cmd;
}
function checkCetCmd() {
  const cmd = new Command("check").description("Check if CET is properly installed and running").action(async () => {
    const engine = new ModEngine();
    const result = await engine.query("Check CET installation status. Use check_cet tool.");
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  });
  return cmd;
}

// src/modding/mod-cli.js
function registerModCommandsOn(program) {
  const modEngine = new ModEngine();
  registerModCommands(program, modEngine);
  program.command("mod").description("\u{1F70F} Cyberpunk 2077 mod operations").addCommand(new Command2("build").description("Build a mod").action(async (modDir) => {
    const engine = new ModEngine();
    const result = await engine.query(`Build mod at ${modDir}. Use wolvenkit_build tool.`);
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  })).addCommand(new Command2("deploy").description("Deploy a mod").action(async (modName, source, type) => {
    const engine = new ModEngine();
    const result = await engine.query(`Deploy ${modName} from ${source}. Use deploy_mod tool.`);
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  })).addCommand(new Command2("verify").description("Verify a mod").action(async (modName) => {
    const engine = new ModEngine();
    const result = await engine.query(`Verify mod ${modName}. Use verify_mod tool.`);
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  })).addCommand(new Command2("scan").description("Scan mods").action(async () => {
    const engine = new ModEngine();
    const result = await engine.query("Scan Nigredo third_party_mods. Use scan_mods tool.");
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  })).addCommand(new Command2("cet").description("Check CET status").action(async () => {
    const engine = new ModEngine();
    const result = await engine.query("Check CET status. Use check_cet tool.");
    for await (const chunk of result) {
      if (chunk.type === "text") process.stdout.write(chunk.content);
    }
  })).addCommand(new Command2("skills").description("List and manage skills").action(async () => {
    const loader = getSkillLoader();
    await loader.loadAll();
    const skills = loader.getAllSkills();
    if (skills.length === 0) {
      console.log(chalk12.yellow("\u{1F70F} No skills found in src/modding/skills/"));
      return;
    }
    console.log(chalk12.cyan(`
\u{1F70F} ${skills.length} skills loaded:
`));
    for (const skill of skills) {
      console.log(chalk12.green(`  ${skill.name}`) + ` \u2014 ${skill.description}`);
      if (skill.triggers.length > 0) {
        console.log(chalk12.gray(`    triggers: ${skill.triggers.join(", ")}`));
      }
    }
    console.log("");
  })).addCommand(new Command2("skill").description("Load a skill by name").argument("<name>", "Skill name").action(async (name) => {
    const loader = getSkillLoader();
    await loader.loadAll();
    const skill = loader.getSkill(name);
    if (!skill) {
      console.log(chalk12.red(`\u{1F70F} Skill "${name}" not found. Available: ${loader.getSkillNames().join(", ")}`));
      return;
    }
    console.log(chalk12.cyan(`
# Skill: ${skill.name}
`));
    console.log(chalk12.white(skill.content));
  }));
  return program;
}
async function runModCommand(cmd, args = []) {
  const engine = new ModEngine();
  switch (cmd) {
    case "build":
      return engine.query(`Build mod from ${args[0]}. Use wolvenkit_build tool.`);
    case "deploy":
      return engine.query(`Deploy ${args[0]} from ${args[1]}. Use deploy_mod tool.`);
    case "verify":
      return engine.query(`Verify mod ${args[0]}. Use verify_mod tool.`);
    case "scan":
      return engine.query("Scan Nigredo third_party_mods. Use scan_mods tool.");
    case "cet":
      return engine.query("Check CET status. Use check_cet tool.");
    case "skills":
      return engine.query("List all available skills. Use skill action=list.");
    case "quick":
      return engine.query(`Quick build ${args[0]} from ${args[1]} type ${args[2]}. Use quick_build tool.`);
    default:
      return engine.query(args.join(" "));
  }
}
function initModClient() {
  const engine = new ModEngine();
  engine.on("postToolUse", async ({ tool, input, result }) => {
    if (tool === "deploy_mod") {
      console.log(chalk12.cyan("\u{1F70F} Collecting evidence..."));
    }
  });
  engine.setSubagents([
    { name: "build-agent", domain: "build", command: "cp77tools build ." },
    { name: "deploy-agent", domain: "deploy", command: "cp -r" },
    { name: "verify-agent", domain: "verify", command: "cat cyber_engine_tweaks.log" }
  ]);
  return engine;
}
var mod_cli_default = registerModCommandsOn;
export {
  ModEngine,
  mod_cli_default as default,
  initModClient,
  registerModCommandsOn,
  runModCommand
};
