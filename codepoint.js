var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        if (args) {
            var codes = builder.EntityRecognizer.findEntity(args.intent.entities, 'codepoints');
            if(codes) {
                return next({ response: session.message.text.substring(codes.startIndex, codes.endIndex+1) });
            } else {
                if (session.message.text.startsWith('codepoint ') && session.message.text.length > 10) {
                    return next({response: session.message.text.substring(11)});
                }
                session.send("Sorry, I did not understand.");
            }
        }

        builder.Prompts.text(session, "Please input string for output codepoints.");
    },
    function (session, results) {
        console.log("Print code points for : " + results.response);
        var content = results.response;
        session.send(getcodepoint(content));
        session.endDialog();
    }
];

function getcodepoint(content) {
    var result = "Code point for '" + content + "' :\n[";
    var TEN_BITS = parseInt('1111111111', 2);
    function u(codeUnit) {
      return '\\u'+codeUnit.toString(16).toUpperCase();
    }

    for(var i=0; i< content.length; i++) {
        var codePoint = content.codePointAt(i);
        if (codePoint <= 0xFFFF) {
            result += u(codePoint);
        } else {
            codePoint -= 0x10000;
            // Shift right to get to most significant 10 bits
            var leadingSurrogate = 0xD800 | (codePoint >> 10);
            // Mask to get least significant 10 bits
            var trailingSurrogate = 0xDC00 | (codePoint & TEN_BITS);
            result += u(leadingSurrogate) + u(trailingSurrogate);
            i++;
        }
        result += " ";
    }
        return result + "]";
}
