import { Component, OnInit } from '@angular/core';
import { AddFrequenterModel } from 'src/app/models/environments/add-frequenter.model';
import { EvironmentModel } from 'src/app/models/environments/environment.model';
import { EnvironmentsFilter } from 'src/app/models/environments/environments.filter';
import { EnvironmentsResponse } from 'src/app/models/environments/environments.response';
import { EnvironmentResponse } from 'src/app/models/environments/environment.response';
import { EnvironmentsService } from 'src/app/services/environments.service';
import { UsersService } from 'src/app/services/users.service';
import { MessageService } from 'primeng/api';

const FREQUENTER = 2, MANAGER = 3, TEMPORARY = 4;

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {
  addUserOptions: any[] = [{ label: 'FREQUENTADOR', value: FREQUENTER }, { label: 'SUPERVISOR', value: MANAGER }, { label: 'TEMPORÁRIO', value: TEMPORARY }];
  addUserOptionSelected: number = FREQUENTER | MANAGER | TEMPORARY;
  addUserDialog: boolean = false;
  addEnvirionmentDialog: boolean = false;

  environmentModel: EvironmentModel;

  addFrequenterModel: AddFrequenterModel;
  selectedEnvironmentToAddUser: any;

  environments: EnvironmentsResponse;
  selectedEnvironment: any;

  environmentsToSelect: any;
  usersCount: any;
  environmentFrequenters: any;
  environmentsManagers: any;
  selectedFrequenter: any;
  selectedManager: any;

  frequenters: any;
  managers: any;

  submitted: boolean = false;

  filter: EnvironmentsFilter;

  constructor(
    private messageService: MessageService,
    private environmentService: EnvironmentsService,
    private userService: UsersService
  ) { }

  async ngOnInit() {
    this.filter = new EnvironmentsFilter();
    this.filter.previous = 0;
    this.filter.next = 1;
    this.filter.pageSize = 10;
    this.filter.select = {
      id: true,
      name: true,
      description: true,
      active: true,
      created_at: true,
      updated_at: true,
      user_name: true,
      environment_user: {
        select: {
          user_id: true,
          user_name: true
        }
      },
      environment_manager: {
        select: {
          user_id: true,
          user_name: true
        }
      }
    };
    this.filter.where = {active: true};
    this.filter.orderBy = {created_at: "desc"};

    this.environments = new EnvironmentsResponse();
    await this.handleEnvironments();

    this.addUserOptionSelected = FREQUENTER;
    this.addFrequenterModel = new AddFrequenterModel();

    this.frequenters = await this.getFrequenters().then(data => {
      return data.map(frequenter => {
        return {
          label: frequenter.name,
          value: frequenter.id
        }
      })
    });
    //console.log(this.frequenters);

    this.selectedEnvironmentToAddUser = null;
    this.selectedFrequenter = null;

    this.environmentModel = new EvironmentModel();
  }

  requiredField(field: any): boolean {
    if (this.submitted && !field) {
      return true;
    }

    return false;
}
  public restart() {
    location.reload();
  }

  async getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
       
          this.environmentModel.latitude = position.coords.latitude,
          this.environmentModel.longitude = position.coords.longitude
      
      });
    } else {
      console.log('Geolocalização não é suportada pelo seu navegador.');
      this.environmentModel.latitude = 0.0000000,
      this.environmentModel.latitude = 0.0000000
  
    }

  }

  async createEnvironment(): Promise<EnvironmentResponse> {
    this.submitted = true;
    console.log("create environment");
    return new Promise((resolve) => {
      this.environmentService.createEnvironment(this.environmentModel).subscribe({
          next: (response: EnvironmentResponse) => {
              this.environmentModel.name = "";
              this.environmentModel.description = "";
              this.addSuccessMessage('Novo ambiente criado com sucesso');
              resolve(response);
          },
          error: () => {
              this.addErroMessage('Erro ao tentar criar novo ambiente');
              resolve(null);
          }
      })

    
  });


  }

  async resCreateEnvironment(): Promise<void>{
    const responseEnv = await this.createEnvironment();
    if (!responseEnv) {
      this.addErroMessage('Erro ao tentar criar novo ambiente.');
    } else {
      this.addSuccessMessage('Novo ambiente criado com sucesso.');
      //this.hideDialog();
      this.restart();
    }
  }

  async searchEnvironments() {
    console.log("search environments");
  }

  async editEnvironment(id: string) {
    this.selectedEnvironment = this.environments.data.find(environment => environment.id === id);
    //
    console.log(this.selectedEnvironment);
  }

  get frequenter(): number {
    return FREQUENTER;
  }

  get manager(): number {
    return MANAGER;
  }

  get temporary(): number {
    return TEMPORARY;
  }

  hideEnvironmentDialog() {
    this.selectedEnvironment = null;
  }

  hideAddUserDialog() {
    this.addUserDialog = false;
  }
  hideAddEnvirionmentDialog(){
    this.addEnvirionmentDialog = false;
    this.submitted = false;
  }


  handleEnvironmentDialog() {
    console.log("handle environment dialog");
  }

  changeUserAddOptions(event: any): void {
    console.log('change user ddd options');
  }

  addUser() {
    this.addUserDialog = true;
  }
  addEnvirionment(){
    this.addEnvirionmentDialog = true;
    this.getLocation();
  }

  onEnvironmentSelected() {
    console.log("on environment selected: ", this.selectedEnvironmentToAddUser);
  }


  private countEnvironmentUsers() {
    const usersCount = {};
    this.environments.data.forEach(environment => {
      usersCount[environment.id] = environment.environment_user.length + environment.environment_manager.length;
    });
    return usersCount;
  }

  private extratcEnvironmentFrequenters() {
    const frequenters = {};
    this.environments.data.forEach(environment => {
      frequenters[environment.id] = environment.environment_user.map(user => {
        return {
          name: user.user_name,
          id: user.user_id
        }
      });
    });
    return frequenters;
  }

  private extractEnvironmentManagers() {
    const managers = {};
    this.environments.data.forEach(environment => {
      managers[environment.id] = environment.environment_manager.map(user => {
        return {
          name: user.user_name,
          id: user.user_id
        }
      });
    });
    return managers;
  }

  private getFrequenters() {
    const frequenters: any = new Promise((resolve) => {
      this.userService.getFrequenterUser().subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });

    return frequenters;
  }


  private async getEnvironments(): Promise<EnvironmentsResponse> {
    return new Promise((resolve) => {
      this.environmentService.getEnvironments(this.filter).subscribe({
        next: (response: EnvironmentsResponse) => {
          resolve(response);
        },
        error: () => {
          resolve(null);
        }
      })
    });
  }

  private async handleEnvironments() {
    this.environments = await this.getEnvironments().then(data => data);
    this.environmentsToSelect = [
      {id: 'empty', name: 'Selecione um ambiente'},
      ...this.environments.data
    ];
    this.usersCount = this.countEnvironmentUsers();
    this.environmentFrequenters = this.extratcEnvironmentFrequenters();
    this.environmentsManagers = this.extractEnvironmentManagers();
  }

  private addErroMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 3000 });
  }

  private addSuccessMessage(msg: string): void {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  }
}