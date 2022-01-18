import { google } from 'googleapis'
import path from 'path'
const fs = require('fs').promises;
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses',
    'https://www.googleapis.com/auth/classroom.coursework.students',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/classroom.profile.emails',
    'https://www.googleapis.com/auth/classroom.profile.photos',
    'https://www.googleapis.com/auth/classroom.rosters',
];

export class Authenticator {
    private tokenPath: string
    private credentialsPath: string
    constructor(tokenPath?: string, credentialsPath?: string) {
        if (!tokenPath) {
            tokenPath = path.resolve(__dirname, '../token.json')
        }
        this.tokenPath = tokenPath
        if (!credentialsPath) {
            credentialsPath = path.resolve(__dirname, '../credentials.json')
        }
        this.credentialsPath = credentialsPath
    }
    authenticate(): Promise<string> {
        return fs.readFile(this.credentialsPath)
            .then((content: string) =>
                this.authorize(JSON.parse(content), this.tokenPath))
            .catch((err: Error) => {
                console.log('Error loading client secret file:', err)
                process.exit(1)
            })
    }

    private authorize(credentials: any, tokenPath?: string) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        return fs.readFile(tokenPath || this.tokenPath)
            .then((token : string) => { oAuth2Client.setCredentials(JSON.parse(token)); return oAuth2Client })
            .catch(() => this.getNewToken(oAuth2Client))
    }

    private getNewToken(oAuth2Client: any) {
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
                    fs.writeFile(this.tokenPath, JSON.stringify(token))
                        .then(() => {
                            console.log('Token stored to', this.tokenPath)
                            resolve(oAuth2Client);
                        })
                        .catch((err: Error) => console.error(err))
                });
            })
        })
    }
}