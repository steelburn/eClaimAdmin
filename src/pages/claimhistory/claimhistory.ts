import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController } from 'ionic-angular';
import { Services } from '../Services';
import { TranslateService } from '@ngx-translate/core';

import { FormControlDirective, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

import * as constants from '../../app/config/constants';
import { BaseHttpService } from '../../services/base-http';
//import { ClaimHistory_Model } from '../../models/claimhistory_model';
import { ClaimhistorydetailPage } from '../claimhistorydetail/claimhistorydetail';
import { ResourceLoader } from '@angular/compiler';
import { Checkbox } from 'ionic-angular/components/checkbox/checkbox';

/**
 * Generated class for the ClaimhistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-claimhistory',
  templateUrl: 'claimhistory.html', providers: [BaseHttpService]
})
export class ClaimhistoryPage {
 // tenentCompanySiteGuid: any;
  // EmpNames: any; 
  // posts :any;

 // ClaimHistory_Model = new ClaimHistory_Model();
 //public employee: ClaimHistory_Model[] = [];
 public temp:any[] = [];
 public fullNameDD:string[]=[];
 public departmentDD:string[]=[];
  isActive:boolean;
  public e:any;
  public EmpClicked: boolean = false;
  public MonthClicked: boolean = false;
  public DeptClicked: boolean = false;
 claimhistorys:any[];
 claimhistorys1:any[];
 listemployees:any[];
 listdepartments:any[];
 selectedAll: any;

  baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/zcs/_table/vw_claimhistory?filter=(TENANT_COMPANY_SITE_GUID='+localStorage.getItem("g_TENANT_COMPANY_SITE_GUID") + ')&api_key=' + constants.DREAMFACTORY_API_KEY;
  //emailUrl:string=constants.DREAMFACTORY_INSTANCE_URL +'/api/v2/emailnotificationtest?api_key=' + constants.DREAMFACTORY_API_KEY;
  //result:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public http: Http, private httpService: BaseHttpService) {
    //console.log(this.baseResourceUrl);
    this.BindData();
    this.BindEmployeeDataForDropDown();
    this.BindDeptDatatoDropDown();
  }
 
  BindData()
  {
    this.http
        .get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe(data => {
          this.claimhistorys = data.resource;
        });
  }

  checkIfAllSelected() {
    this.selectedAll = this.fullNameDD.every(function(item:any) {
      console.log(item.value)
        return item.selected == true;
      })
  }

  onSearchInput(ev: any) {  
    // alert(ev)
          let val = ev.target.value;
          if (val && val.trim() != '') {
           this.claimhistorys = this.claimhistorys.filter((item) => {
         
             console.log(item);
             return ((item.FULLNAME.toLowerCase().indexOf(val.toLowerCase()) > -1) 
             || ((item.MONTH.toString().toLowerCase().indexOf(val.toLowerCase()) > -1) 
             || (item.YEAR.toString().toLowerCase().indexOf(val.toLowerCase()) > -1))
             || (item.CLAIM_AMOUNT.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
           ) 
           );
           })
         }
         else
         {
           this.BindData();
         }
   }

   BindEmployeeDataForDropDown()
   {
     //alert('hi');
     this.http
         .get(this.baseResourceUrl)
         .map(res => res.json())
         .subscribe(data => {
           this.listemployees = data.resource;
           this.listemployees.forEach(Item => {
             this.fullNameDD.push(Item.FULLNAME)
           });       
           this.fullNameDD.sort();
          for (let index = 0; index < this.fullNameDD.length; index++) {
            const element = this.fullNameDD[index+1];
            if(element===this.fullNameDD[index]){
             this.fullNameDD.splice(index, 1);
             index=-1;
            }
          }
         // console.table(this.fullNameDD)
         });
   }

   BindDeptDatatoDropDown()
   {
     //alert('hi');
     this.http
         .get(this.baseResourceUrl)
         .map(res => res.json())
         .subscribe(data => {
           this.listdepartments = data.resource;
           this.listdepartments.forEach(Item => {
             this.departmentDD.push(Item.DEPARTMENT)
           });       
           this.departmentDD.sort();
          for (let index = 0; index < this.departmentDD.length; index++) {
            const element = this.departmentDD[index+1];
            if(element===this.departmentDD[index]){
             this.departmentDD.splice(index, 1);
             index=-1;
            }
          }
          console.table(this.departmentDD)
         });
   }

   onFilter_Name(id:Checkbox,employee:any)
    {
        this.http.get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe((data) => {
          this.claimhistorys =data.resource;

          if(id.checked)
          {
           // this.claimhistorys = this.claimhistorys.filter(item => item.FULLNAME.toLowerCase() == employee.toLowerCase());
            this.claimhistorys= this.claimhistorys.filter((item) =>
            {   
                if((item.FULLNAME.toLowerCase().indexOf(employee.toLowerCase()) > -1))
                {
                    this.temp.push(item);
                    console.table(this.temp)   
                }  
            })
           this.claimhistorys = this.temp;
          }
          else
          {
            this.temp = this.temp.filter(item =>  item.FULLNAME.toLowerCase() !== employee.toLowerCase());
            this.claimhistorys = this.temp;
          }
         
      })    
    }

    onFilter_Dept(id:Checkbox,department:any)
    {
        this.http.get(this.baseResourceUrl)
        .map(res => res.json())
        .subscribe((data) => {
          this.claimhistorys =data.resource;

          if(id.checked)
          {
           // this.claimhistorys = this.claimhistorys.filter(item => item.FULLNAME.toLowerCase() == employee.toLowerCase());
            this.claimhistorys= this.claimhistorys.filter((item) =>
            {   
                if((item.DEPARTMENT.toLowerCase().indexOf(department.toLowerCase()) > -1))
                {
                    this.temp.push(item);
                    console.table(this.temp)   
                }  
            })
           this.claimhistorys = this.temp;
          }
          else
          {
            this.temp = this.temp.filter(item =>  item.DEPARTMENT.toLowerCase() !== department.toLowerCase());
            this.claimhistorys = this.temp;
          }
         
      })    
    }

    onFilter_Month(id:Checkbox)
    {
      alert(id.checked)
      var selected = [];
      for (var i=0; i<Checkbox.length; i++) {
        // if (Checkbox[i].checked) {
        //     selected.push(Checkbox[i].value);
        // }
    }

    }
    EmpClick()
    {
       this.EmpClicked = !this.EmpClicked;
       this.temp=[];
    }
    MonthClick()
    {
      this.MonthClicked = !this.MonthClicked;
    }

    DeptClick()
    {
      this.DeptClicked = !this.DeptClicked;
    }
 
    DeptClose()
  {
    this.DeptClicked=false;
  } 

  MonthClose()
  {
    this.MonthClicked=false;
  }
  EmployeeClose()
  {
    this.EmpClicked=false;
  }
    ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimhistoryPage');
  }


  goToClaimHistoryDetail(claimrefguid:any,userguid:any,month:any){
    this.navCtrl.push(ClaimhistorydetailPage,{
    claimRefGuid:claimrefguid,
    userGuid:userguid,
    Month:month
     } )
  }

  


//   goToEmailTest(){
//     var queryHeaders = new Headers();
//     queryHeaders.append('Content-Type', 'application/json');
//     queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
//     queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
//     let options = new RequestOptions({ headers: queryHeaders });

// let body = {
//   "template": "",           
//   "template_id": 0,        
//   "to": [
//     {
//       "name": "ajay varma",
//       "email": "ajayvarma403@gmail.com"
//     }
//   ],
//   "cc": [
//     {
//       "name": "fdf",
//       "email": "ajayvarma403@gmail.com"
//     }
//   ],
//   "bcc": [
//     {
//       "name": "asd",
//       "email": "ajayvarma403@gmail.com"
//     }
//   ],
//   "subject": "Test",
//   "body_text": "",
//   "body_html": "",
//   "from_name": "Ajay DAV",
//   "from_email": "ajay1591ani@gmail.com",
//   "reply_to_name": "",
//   "reply_to_email": ""
//       };
      
// this.http.post(this.emailUrl, body,options)
// .map(res => res.json())
// .subscribe(data => {
//  // this.result= data["resource"];
//   alert(JSON.stringify(data));
// });

// }    

}
