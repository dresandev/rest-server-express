const mongoose = require('mongoose');

const dbCOnexion = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_CNN);

        console.log('base de datos online');

    } catch (err) {
        console.log(err);
        throw new Error('Error a la hora de conectarse a la base de datos');
    }
}

module.exports = {
    dbCOnexion
}