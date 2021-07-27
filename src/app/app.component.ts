import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import { ZoomMtg } from '@zoomus/websdk';
import { FormsModule, FormGroup } from '@angular/forms';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  shape: FormGroup;

  joinMeetingForm = {
    meetingNumber: '',
    userName: '',
    userEmail: '',
    passWord: ''
  }

  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  signatureEndpoint = 'https://zoom-node-handin-test.herokuapp.com/'
  apiKey = 'NWoHr3i3T-qsQtrvDqQNnA'
  // meetingNumber = '77312020458'
  role = 0
  leaveUrl = 'http://localhost:4200'
  // userName = 'Samito'
  // userEmail = 'narutouzumakinamikazex4@gmail.com'
  // passWord = 'cn8x5k'
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/meetings/join#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/build/webinars/join#join-registered-webinar
  registrantToken = ''

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  ngOnInit() {

  }

  putMeetData(event: any) {
    // console.log(event.target.name);
    
    if (event.target.name == "meetingNumber") {
      this.joinMeetingForm.meetingNumber = event.target.value
    }
    if (event.target.name == "userName") {
      this.joinMeetingForm.userName = event.target.value
    }
    if (event.target.name == "userEmail") {
      this.joinMeetingForm.userEmail = event.target.value
    }
    if (event.target.name == "passWord") {
      this.joinMeetingForm.passWord = event.target.value
    }
  }

  agregar() {
    console.log(this.joinMeetingForm);
  }

  getSignature() {
    this.httpClient.post(this.signatureEndpoint, {
	    meetingNumber: this.joinMeetingForm.meetingNumber,
	    role: this.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        console.log(data.signature)
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      success: (success) => {
        console.log(success)
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.joinMeetingForm.meetingNumber,
          userName: this.joinMeetingForm.userName,
          apiKey: this.apiKey,
          userEmail: this.joinMeetingForm.userEmail,
          passWord: this.joinMeetingForm.passWord,
          tk: this.registrantToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
