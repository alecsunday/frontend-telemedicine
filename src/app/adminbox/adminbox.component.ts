import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Admin } from '../admin/Admin';
import { MessageType } from '../enumeration/MessageType';
import { Message } from '../message/message';
import { MessageService } from '../message/message.service';
import { User } from '../user/User';
import { UserService } from '../user/user.service';
import { UserSession } from '../user/UserSession';

@Component({
  selector: 'app-abox',
  templateUrl: './adminbox.component.html',
  styleUrls: ['./adminbox.component.css']
})
export class aBoxComponent implements OnInit {

  received_messages = [];
  sent_messages = [];
  user: Admin;
  senderId = null;
  receiverId = null;
  received=false;
  sent=false;
  recieverName = [];
  sentName = [];

  constructor(private messageService: MessageService, private userService: UserService) { }

  ngOnInit() {
    this.user = UserSession.getUserSession();
    this.getMessages();
  }

   /**
     * Fetched messagesd that have already been sent
     */
    getMessages() {
      this.received_messages = [];
      this.sent_messages = [];
      this.recieverName = [];
      this.sentName = [];
      this.messageService.getMessages(this.user.id).subscribe((message: Message[]) =>{
          message.forEach(m =>{
              if(m.messageType == MessageType.EMAIL){
                if(m.sender_id == this.user.id.toString()){
                  this.sent_messages.push(m);
                  this.userService.getUser(m.receiver_id).subscribe((data:User)=> {
                    this.recieverName.push(data.fname + " " + data.lname);
                  })
                  this.sent=true;
                } else {
                  this.received_messages.push(m);
                  this.userService.getUser(m.sender_id).subscribe((data:User)=> {
                    this.sentName.push(data.fname + " " + data.lname);
                  })
                  this.received=true;
                }
                  
              }
          });
      });
  }
  
  /**
   * Adds new message to chat
   */
  submit(form: NgForm){
      this.userService.getUserByEmail(form.value.uemail).subscribe((data: User)=>{
        this.senderId = data.id;
        this.userService.getUserByEmail(form.value.remail).subscribe((data1: User)=>{
          this.receiverId = data1.id;

          let d = new Date();
          let message = {
              sender_id: this.senderId,
              receiver_id: this.receiverId,
              date: null,
              content: form.value.content,
              time: null,
              messageType: MessageType.EMAIL,
              subject: form.value.subject
          }
          this.messageService.saveMessage(message).forEach(m => m)
          window.location.reload();
        })
      })
     
  }

  
  openNav(){
    document.getElementById("mysideBar").style.width = "400px";
    document.getElementById("main").style.marginLeft = "400px";
  }

  closeNav(){
    document.getElementById("mysideBar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
  

}

