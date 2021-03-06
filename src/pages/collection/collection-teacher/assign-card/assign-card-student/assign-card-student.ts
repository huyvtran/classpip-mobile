/**
 * Created by manel on 31/5/17.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  Loading, NavController, NavParams,
  Platform
} from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {CollectionCard} from "../../../../../model/collectionCard";
import {Student} from "../../../../../model/student";
import {UtilsService} from "../../../../../providers/utils.service";
import {CollectionService} from "../../../../../providers/collection.service";
import {IonicService} from "../../../../../providers/ionic.service";
import {Card} from "../../../../../model/card";
import {MenuPage} from "../../../../menu/menu";
import {CollectionTpage} from "../../collection-teacher";



declare let google;
declare let cordova;


@Component({
  selector: 'page-assign-card-student',
  templateUrl: './assign-card-student.html'
})
export class CardAssignStudent {

  @ViewChild('map') mapElement: ElementRef;
  public collectionCard: CollectionCard = new CollectionCard();
  public cards: Array<Card> = Array<Card>();
  loading: Loading;
  public students: Array<Student>;
  constructor(
    public navParams: NavParams,
    public navController: NavController,
    public utilsService: UtilsService,
    public collectionService: CollectionService,
    public translateService: TranslateService,
    public ionicService: IonicService,
    public platform: Platform,
    ) {

    this.collectionCard.id = this.navParams.data.id;
    this.students = this.navParams.data.students;
    this.cards = this.navParams.data.cards;
  }

  /**
   * This method assign the cards passed from the other form
   * to the studentId passed as parameter
   * @param {int} studentId
   */
  public assignCardToStudents(studentId) {
    for (let i=0 ; i<this.cards.length ; i++){
      this.collectionService.assignCardToStudent(studentId,this.cards[i].id).subscribe(response => {
          this.utilsService.presentToast(this.translateService.instant('CARD-ASSIGN.OK'));
        },
        error => {
          this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        });
    }
    this.navController.setRoot(MenuPage).then(()=>{
      this.navController.push(CollectionTpage);
    });
  }

  /**
   * This method assign the cards passed from the other form
   * to a random student from the list of the students selecteds
   */
  public assignToRandomStudent(){
    let studentPosition = this.randomNumber(0,this.students.length);
    let studentName;
    this.students.forEach(student => {
      if (student.id == this.students[studentPosition].id) {
        studentName = student.name
      }
    });
    for (let i=0 ; i<this.cards.length ; i++) {
      this.collectionService.assignCardToStudent(this.students[studentPosition].id, this.cards[i].id).subscribe(response => {
          this.utilsService.presentToast(this.translateService.instant('CARD-ASSIGN.RANDOK') + studentName + ')');
          },
          error => {
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      });
    }
    this.navController.setRoot(MenuPage).then(() => {
      this.navController.push(CollectionTpage);
    });
  }

  /**
   * This method returns a random number
   * between the two values  passsed as parameters
   * @param1 min
   * @param2 max
   */
  public randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}
