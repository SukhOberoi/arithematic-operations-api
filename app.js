const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

function calculateExpression(expression) {
    const precedence = {
        'plus': 1,
        'minus': 1,
        'into': 2,
        'div': 2,
    };

    function applyOperator(operators, numbers) {
        const operator = operators.pop();
        const operand2 = numbers.pop();
        const operand1 = numbers.pop();

        switch (operator) {
            case 'plus':
                numbers.push(operand1 + operand2);
                break;
            case 'minus':
                numbers.push(operand1 - operand2);
                break;
            case 'into':
                numbers.push(operand1 * operand2);
                break;
            case 'div':
                numbers.push(operand1 / operand2);
                break;
        }
    }

    const numbers = [];
    const operators = [];

    for (const token of expression) {
        if (!isNaN(token)) {
            numbers.push(parseFloat(token));
        } else if (token in precedence) {
            while (
                operators.length &&
                precedence[token] <= precedence[operators[operators.length - 1]]
            ) {
                applyOperator(operators, numbers);
            }
            operators.push(token);
        } else {
            throw new Error('Invalid token: ' + token);
        }
    }

    while (operators.length) {
        applyOperator(operators, numbers);
    }

    if (numbers.length !== 1) {
        throw new Error('Invalid expression');
    }

    return numbers[0];
}



app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/*', (req, res) => {
    const path = req.params[0]; // Captures the entire URL path
    const segments = path.split('/');
    console.log(path);
    console.log(segments);
    const result = calculateExpression(segments);
    for (let i=1; i<segments.length-1; i+=2){
        switch(segments[i]){
            case 'plus':
                segments[i]="+";
                break;
            case 'minus':
                segments[i]="-";
                break;
            case 'into':
                segments[i]="*";
                break;
            case 'div':
                segments[i]="/";
                break;
        }
    }
    let expr=segments.join("");
    res.json({ question:expr, answer: result });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
