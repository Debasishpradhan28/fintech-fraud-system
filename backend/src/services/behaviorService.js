const calculateBehaviorRisk =
async (
    client,
    userId,
    deviceFingerprint,
    location
) => {

    let risk = 0;

    const knownDevice =
    await client.query(
    `
    SELECT *
    FROM devices
    WHERE user_id=$1
    AND device_fingerprint=$2
    `,
    [
        userId,
        deviceFingerprint
    ]
    );

    if(knownDevice.rows.length === 0){
        risk += 30;
    }

    const knownLocation =
    await client.query(
    `
    SELECT *
    FROM devices
    WHERE user_id=$1
    AND location=$2
    `,
    [
        userId,
        location
    ]
    );

    if(knownLocation.rows.length === 0){
        risk += 20;
    }

    const hour =
        new Date().getHours();

    if(hour >= 1 && hour <= 5){
        risk += 15;
    }

    return risk;

};

module.exports = {
    calculateBehaviorRisk
};