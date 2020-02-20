import { sha256 } from 'react-native-sha256';

export function sha256Hash(message, cb) {
    sha256(message).then( hash => {
        cb(hash)
    })
}