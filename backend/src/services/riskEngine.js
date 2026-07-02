const calculateRiskScore = (amount) => {

    let risk = 0;

    if(amount > 1000){
        risk += 20;
    }

    if(amount > 10000){
        risk += 30;
    }

    if(amount > 50000){
        risk += 40;
    }

    return Math.min(risk,100);
};

module.exports = {
    calculateRiskScore
};