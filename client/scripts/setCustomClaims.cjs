const admin = require('firebase-admin')
const serviceAccount = require('../../keys/coffee-tracker-a75fa-firebase-adminsdk-fbsvc-ad95b78472.json')
const {getFirestore} = require('firebase-admin/firestore')
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://coffee-tracker-a75fa.firebaseio.com'
})

const prod = false

//const db = prod ? getFirestore(app) : getFirestore(app, 'ct-dev')
const db = getFirestore(app)

// Custom claims to set
const _allClaims = {
    admin: true,
    raflAdmin: true,
    qaUser:true,
    dataAdmin:true    // can write to firebase: data-cache
}
const newClaims = {admin: true}

const users = [
    {uid: 'SFT4BPgYIvOGkIS2piPe1SRdHw73', name: 'mgsecure'},
]

const _allUsers = [
    {uid: 'SFT4BPgYIvOGkIS2piPe1SRdHw73', name: 'mgsecure'},
]

async function updateCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        try {
            const userRecord = await admin.auth().getUser(uid)
            const currentClaims = userRecord.customClaims || {}
            delete currentClaims.lpuMod
            const updatedClaims = {...currentClaims, ...newClaims}
            await admin.auth().setCustomUserClaims(uid, updatedClaims)

            const ref = db.doc(`/user-claims-info/${uid}`)
            await ref.set({...updatedClaims, name})

            console.log(`Updated custom claims for user ${uid} (${userRecord.displayName})`, updatedClaims)
        } catch (error) {
            console.error(`Error updating custom claims for user ${uid}:`, error)
        }
    }
    console.log('Finished updating custom claims for all users.')
    process.exit(0)
}

async function getCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        await admin.auth().getUser(uid)
            .then(userRecord => {
                console.log('Custom claims for user', uid, `(${name})`, userRecord.customClaims)
            })
            .catch(error => {
                console.error('Error fetching user data:', error)
            })
    }
    console.log('Finished logging custom claims for all users.')
    process.exit(0)
}

updateCustomClaimsForUsers().then(() => {
    getCustomClaimsForUsers().then()
})


