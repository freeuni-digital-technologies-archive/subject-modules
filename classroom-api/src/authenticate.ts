import { google } from 'googleapis'

const fs = require('fs').promises;
const readline = require('readline');

const TOKEN_PATH = process.env.CLASSROOM_TOKEN_PATH || 'token.json'
const CREDENTIALS_PATH = process.env.CLASSROOM_CREDENTIALS_PATH || 'credentials.json'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses',
    'https://www.googleapis.com/auth/classroom.coursework.students',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    'https://www.googleapis.com/auth/classroom.profile.photos',
    'https://www.googleapis.com/auth/classroom.rosters',
];

export default function authenticate(credentials?: string,
                                     token?: string): Promise<string> {
    return fs.readFile(credentials || CREDENTIALS_PATH)
        .then((content: string) =>
            authorize(JSON.parse(content), token))
        .catch((err: Error) =>
            console.log('Error loading client secret file:', err)
        )
}

function authorize(credentials: any, tokenPath?: string) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    return fs.readFile(tokenPath || TOKEN_PATH)
        .then((token : string) => { oAuth2Client.setCredentials(JSON.parse(token)); return oAuth2Client })
        .catch(() => getNewToken(oAuth2Client))
}

function getNewToken(oAuth2Client: any) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        rl.question('Enter the code from that page here: ', (code: string) => {
            rl.close();
            oAuth2Client.getToken(code, (err: Error, token: object) => {
                if (err) reject('Error retrieving access token' + err);
                oAuth2Client.setCredentials(token);
                fs.writeFile(TOKEN_PATH, JSON.stringify(token))
                    .then(() => {
                        console.log('Token stored to', TOKEN_PATH)
                        resolve(oAuth2Client);
                    })
                    .catch((err: Error) => console.error(err))
            });
        })
    })
}