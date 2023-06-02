import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StructureService } from '../services/structure.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manage-structure',
  templateUrl: './manage-structure.component.html',
  styleUrls: ['./manage-structure.component.scss']
})
export class ManageStructureComponent implements OnInit {

  visible: boolean = false;
  update: boolean = false;
  ministereList: any[] = [];
  structureList: any[] = [];
  structureForm!: FormGroup;
  structureUpdateForm!: FormGroup;
  
  displayedColumns: string[] = ['code', 'libelle', 'ministere',''];
  confirmationService: any;

  constructor(private fb: FormBuilder, private structureService: StructureService, confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.initForm();
    this.initUpdateForm();
    this.getAllWithoutMinistere();
    this.getAllStructure();

  }
  

  initForm() {
    this.structureForm = this.fb.group({
      code: ["", Validators.required],
      libelle: ["", Validators.required],
      ministere: ["", Validators.required]
    });
  }

  initUpdateForm() {
    this.structureUpdateForm = this.fb.group({
      code: ["", Validators.required],
      libelle: ["", Validators.required],
      ministere: ["", Validators.required],
      id: [0]
    });
  }

  openDialog() {
    this.visible = true;
  }

  openUpdateDialog(st: any){
    this.update = true;
    this.structureUpdateForm.patchValue({
      code: st.code,
      libelle: st.libelle,
      ministere: st.ministere,
      id: st.id
    })
    console.log(this.structureUpdateForm.value);
    
  }

  getAllWithoutMinistere() {
    this.structureService.getAllStructureWithoutMinistere().subscribe(
      (data: any[]) => {
        console.log(data);
        this.ministereList =  data;
      }
     
    );
    
  }

  getAllStructure() {
    this.structureService.getStructureAll().subscribe((data: any[]) => {
      console.log(data);
      this.structureList = data;
    });
  }
 
  submitStructure() {
    console.log(this.structureForm.value);
    this.structureService.createStructure(this.structureForm.value).subscribe((data: any) => {
      console.log(data);
      this.visible = false;
      this.getAllStructure();
    });
  }

  

  updateStructure() {
    this.structureService.updateStructure(this.structureUpdateForm.value.id, this.structureUpdateForm.value).subscribe((data: any) => {
      console.log(data);
      this.update = false;
      this.getAllStructure();
    });
  }

  deleteStructure(structId: number){
    this.confirmationService.confirm({
      message: 'are you sure that you want to delete this structure!?',
      accept: ()=>{
        this.structureService.deleteStructure(structId).subscribe((data: any)=>{
          console.log(data);
          this.getAllStructure();
          
        })
        
      },
      reject: ()=>{
        console.log("non");
        
      }
    })
    
  }
}
