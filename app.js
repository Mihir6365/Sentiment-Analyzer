var express = require('express');
var app = express();
var url = require("url");
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
const { translate } = require('free-translate');

//setting ejs folder
app.set('view engine', 'ejs');
//setting css and images folder
app.use(express.static("templates"));

//Get the result directly from hindi
//every word is given a score
//more words can be added to the list
//more languages can be added similarly
var hindi_Language = {
    labels: {
        'हानिकर': -2,
        'गुस्सा': -2,
        'परेशान': -2,
        'चिंतित': -3,
        'उदासीनता': -2,
        'भय': -2,
        'अभिमानी': -2,
        'नृशंस': -2,
        'भयंकर': -4,
        'खराब': -3,
        'तुच्छ': -3,
        'कंटीले': -2,
        'रोना': -3,
        'कठोर': -1,
        'लापरवाह': -3,
        'भ्रष्ट': -5,
        'पागल': -4,
        'आपराधिक': -3,
        'निर्दयी': -5,
        'आघात': -1,
        'मृत': -5,
        'खस्ताहाल': -2,
        'विकृत': -2,
        'विकृत': -2,
        'खेदजनक': -2,
        'उदास': -4,
        'वंचित': -1,
        'कीड़ा': -3,
        'नाली': -3,
        'नमस्ते': 1,
        'विदाई': 1,
        'स्वागत': 1,
        'कृप्या': 1,
        'धन्यवाद': 3,
        'माफ़': 2,
        'नमस्कार': 2,
        'सुसंध्या': 2,
        'सुबह': 2,
        'मिलेंगे': 1,
        'खुशी': 4,
        'खुशी': 4,
        'मोक्ष': 4,
        'आशा': 4,
        'सुंदर': 4,
        'पराक्रम': 4,
        'शक्ति': 3,
        'ख्याल': 4
    },
    scoringStrategy: {
        apply: function(tokens, cursor, tokenScore) {
            // strategy to fix negation. if "नहीं" appears in the sentence, it will inverse the score
            var nexttoken = tokens[cursor + 1];
            if (nexttoken == 'नहीं') {
                tokenScore = -tokenScore;
            }

            return tokenScore;
        }
    }
};
sentiment.registerLanguage('hindi', hindi_Language);


app.get('/', function(req, res) {
    var q = url.parse(req.url, true);
    var statement = q.query.input
    if (statement && q.query.language == "Hindi") {
        var result = sentiment.analyze(statement, { language: 'hindi' });
        res.render('index', { score: result.score })
    } else if (statement) {
        var result = sentiment.analyze(statement);
        res.render('index', { score: result.score })
    } else {
        res.render('index', { score: "Enter the input statement" });
    }
});

app.listen(8080);
console.log('http://localhost:8080/');