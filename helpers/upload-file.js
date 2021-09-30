const path = require('path');
const { v4: uuidv4 } = require('uuid');

const defaultValidExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif'
];

const uploadFile = async (files, validExtensions = defaultValidExtensions, folder = '') => {
    return new Promise((resolve, reject) => {
        const { file } = files;

        const nameCutOff = file.name.split('.');
        const extension = nameCutOff[nameCutOff.length - 1];

        if (!validExtensions.includes(extension)) {
            return reject(`la extension: ${extension} no es permitida, solo se permite: ${validExtensions}`);
        }

        const tempName = uuidv4() + '.' + extension;

        //aqui usamos el join, ya que si unimos simplemente las rutas no se regresaria
        //de la carpeta controllers a la raiz para entrar a uploads, ya que estaria buscando
        //una carpeta llamada .. luego uploads y eso claramente no existe
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) return reject(err);

            return resolve(tempName);
        });
    });

}

module.exports = {
    uploadFile
};