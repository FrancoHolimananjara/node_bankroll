const bcrypt = require('bcrypt');

const hashData = async (data,saltRounds = 12)=>{
    try {
        const hashedData = await bcrypt.hash(data,saltRounds);
        return hashedData;
    } catch (error) {
        throw error;
    }
}

module.exports = hashData;