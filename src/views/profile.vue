<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row
          align="center"
          justify="center"
        >

          <v-col >
            <v-card>
              <v-card-text>
                <v-row>
                <v-col md=4 style="margin-left: 20px;">
                <v-row>
                  <v-col>
                  <v-row>
                    <v-avatar v-if="avatar == null" size=200 class="ml-9"><img src="../assets/avatar.jpg" alt="Sören" /></v-avatar>
                    <v-avatar v-else size=200 class="ml-9"><img :src="avatar" alt="Sören" /></v-avatar>
                  </v-row>
                  <v-row>
                    <v-file-input :rules="rules" @change="changeAvatar()" v-model="file" accept="image/png, image/jpeg, image/bmp" color="#DFB2AD" v-if="edit == true"></v-file-input>
                  </v-row>
                  </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="edit == false">
                        <v-row>
                            <label class="title"> Informatie </label>
                        </v-row>
                        <v-row>
                            <v-icon>mdi-card-account-details-outline</v-icon><label class=" mx-2 subtitle-1"> {{ Patient.name }} </label>
                        </v-row>
                        <v-row>
                            <v-icon>mdi-cake</v-icon><label class=" mx-2 subtitle-1"> {{ Patient.birthday }} ({{ Patient.age }} jaar) </label>
                        </v-row>
                        <v-row>
                            <v-icon>mdi-briefcase</v-icon><label class=" mx-2 subtitle-1"> {{ Patient.work }} </label>
                        </v-row>
                    </v-col>
                    <v-col v-else>
                        <v-row>
                            <label class="title"> Informatie </label>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols=1><v-icon style="margin-top: 7px;">mdi-card-account-details-outline</v-icon></v-col>
                            <v-col cols=5><v-text-field single-line v-model="Patient.firstname" color="#DFB2AD" dense placeholder="Voornaam" filled class="subtitle-1"></v-text-field></v-col>
                            <v-col cols=5><v-text-field single-line v-model="Patient.surname" color="#DFB2AD" dense placeholder="Achternaam" filled class="subtitle-1"></v-text-field></v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols=1><v-icon style="margin-top: 7px">mdi-cake</v-icon></v-col>
                            <v-col cols=10>
                              <v-menu v-model="fromDateMenu" :close-on-content-click="false" :nudge-right="40" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field single-line v-on="on" v-model="Patient.birthday" :label="Patient.birthday" color="#DFB2AD" dense placeholder="Geboortedatum" filled class="subtitle-1"></v-text-field>
                                    </template>
                                    <v-date-picker color="#DFB2AD" v-model="Patient.birthdate" @input="changeBirthday()"></v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col cols=1><v-icon style="margin-top: 7px">mdi-briefcase</v-icon></v-col>
                            <v-col cols=10><v-text-field single-line v-model="Patient.work" :label="Patient.work"  color="#DFB2AD" dense placeholder="Werk" filled class="subtitle-1"></v-text-field></v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row v-if="edit == false">
                    <v-col>
                        <v-row>
                            <label class="title"> Contactgegevens </label>
                        </v-row>
                        <v-row>
                            <v-icon>mdi-at</v-icon><label class=" mx-2 subtitle-1"> {{ Patient.email }} </label>
                        </v-row>
                        <v-row>
                            <v-icon>mdi-cellphone</v-icon><label class=" mx-2 subtitle-1"> {{ Patient.phone }} </label>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-row no-gutters>
                        <v-col cols=1><v-icon style="margin-top: 7px">mdi-at</v-icon></v-col>
                        <v-col cols=10><v-text-field single-line v-model="Patient.email" :label="Patient.email" color="#DFB2AD" dense placeholder="E-mailadres" filled class="subtitle-1"></v-text-field></v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols=1><v-icon style="margin-top: 7px">mdi-cellphone</v-icon></v-col>
                        <v-col cols=10><v-text-field single-line v-model="Patient.phone" :label="Patient.phone"  color="#DFB2AD" dense placeholder="Telefoon" filled class="subtitle-1"></v-text-field></v-col>
                    </v-row>
                </v-row>
                </v-col>
                <v-col>
                  <v-row>
                    <label class="title ma-5">Samenvatting</label>
                  </v-row>
                  <v-row v-if="edit == false">
                    <p class="subtitle-1 mx-5">{{ Patient.summary }}</p>
                  </v-row>
                  <v-row v-else>
                    <v-textarea v-model="Patient.summary" single-line :label="Patient.summary" color="#DFB2AD" placeholder="Samenvatting" filled class="subtitle-1 mx-5"></v-textarea>
                  </v-row>
                  <v-row>
                  <v-col  v-if="edit == false">
                    <v-row>
                      <label class="title ma-5">Diagnoses</label>
                    </v-row>
                    <ul class="subtitle-1 mx-5">
                      <li v-for="item in Patient.diagnoses" :key=item>{{ item }}</li>
                    </ul>
                  </v-col>
                  <v-col  v-else>
                    <v-row>
                      <label class="title ma-5">Diagnoses</label>
                    </v-row>
                    <ul class="subtitle-1" style="list-style-type: none;">
                      <li v-for="item in Patient.diagnoses" :key=item >
                        <v-btn icon @click="Patient.diagnoses.splice(Patient.diagnoses.indexOf(item), 1);"><v-icon>mdi-close</v-icon></v-btn>
                        <v-label>{{ item }}</v-label>
                      </li>
                    </ul>
                        <v-row>
                          <v-col cols=7><v-text-field prepend-icon="mdi-plus" @click:prepend="addDiagnose()" color="#DFB2AD" v-model="newDiagnose" single-line placeholder="Nieuw item"></v-text-field></v-col>
                        </v-row>
                  </v-col>
                  <v-col v-if="edit == false">
                    <v-row>
                    <label class="title ma-5">Medicatie</label>
                  </v-row>
                    <ul class="subtitle-1 mx-5">
                      <li v-for="item in Patient.medication" :key=item>{{ item }}</li>
                    </ul>
                  </v-col>
                  <v-col  v-else>
                    <v-row>
                      <label class="title ma-5">Medicatie</label>
                    </v-row>
                    <ul class="subtitle-1" style="list-style-type: none;">
                      <li v-for="item in Patient.medication" :key=item >
                        <v-btn icon @click="Patient.medication.splice(Patient.medication.indexOf(item), 1);"><v-icon>mdi-close</v-icon></v-btn>
                        <v-label>{{ item }}</v-label>
                      </li>
                    </ul>
                        <v-row>
                          <v-col cols=7><v-text-field prepend-icon="mdi-plus" @click:prepend="addMedication()" color="#DFB2AD" v-model="newMedication" single-line placeholder="Nieuw item"></v-text-field></v-col>
                        </v-row>
                  </v-col>
                  </v-row>
                </v-col>
                </v-row>
                <v-row justify="center">
                    <v-btn @click="$router.push('/dagboek')" class="mx-2" color="#DFB2AD">Dagboek</v-btn>
                    <v-btn @click="$router.push('/stressagenda')" class="mx-2" color="#DFB2AD">Agenda</v-btn>
                    <v-btn v-if="edit == false " @click="edit = true" class="mx-2" color="#DFB2AD">Wijzigen</v-btn>
                    <v-btn v-else-if="edit == true && Patient.surname != '' && Patient.firstname != ''" @click="save()" class="mx-2" color="#DFB2AD">Opslaan</v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
  const axios = require('axios');
  const moment = require('moment');

  export default {
    name: 'Analyse',

    data: () => ({
      newMedication: '',
      newDiagnose: '',
      fromDateMenu: false,
      edit: false,
      Months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
      file: '',
      rules: [ value => !value || value.size < 37871 || 'Avatar mag niet groter zijn dan 40KiB' ],
      avatar: null,
      image_edited: false,
      Patient: {
        new: false,
        id: null,
        name: '',
        birthday: '',
        birthdate: '',
        firstname: '',
        surname: '',
        age: '',
        work: '',
        email: '',
        phone: '',
        summary: '',
        diagnoses: [],
        originalDiagnoses: [],
        medication: [],
        originalMedication: [],
      }
    }),
    methods: {
      async changeAvatar() {
        if (this.file.size > 37871) {
          return
        }
        this.image_edited = true;
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
      });

      this.avatar = await toBase64(this.file);
      },
      save() {
        axios.post('http://localhost:8000/save_patient', { patient: this.Patient });

          var to_upload = this.avatar.replace("data:image/png;base64,", "");
          to_upload = to_upload.replace("data:image/jpeg;base64,", "");
          to_upload = to_upload.replace("data:image/jpg;base64,", "");
        if (this.image_edited) { axios.post('http://localhost:8000/edit_avatar', { id: this.Patient.id, image: to_upload }); }
        
        if (this.Patient.new) {
          axios.get('http://localhost:8000/get_newest_patient')
          .then(response => {
            this.edit = false;
            this.Patient.new = false;
            this.$router.push(`/profiel/${response.data[0].id}`)
            this.$router.go();
          })
        }
        else { this.$router.go(); }
      },
      addMedication() {
        this.Patient.medication.push(this.newMedication);
        this.newMedication = '';
      },
      addDiagnose() {
        this.Patient.diagnoses.push(this.newDiagnose);
        this.newDiagnose = '';
      },
      changeBirthday() {
        this.Patient.birthday = moment(new Date(this.Patient.birthdate)).format("DD--YYYY");
        this.Patient.birthday = this.Patient.birthday.replace("--", ' ' + this.Months[new Date(this.Patient.birthdate).getMonth()] + ' ');
        this.Patient.age = this.getAge(this.Patient.birthdate);
        this.fromDateMenu = false;
      },
      getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
            age--;
        return age;
      }
    },
    async created() {
        if (this.$route.params.id != "new") {
          axios.get('http://localhost:8000/profile?id=' + this.$route.params.id)
          .then(response => {
            for (const user of Object.values(response.data)) {
              this.Patient.id = this.$route.params.id;
              this.Patient.name = user.name + ' ' + user.surname;
              this.Patient.firstname = user.name;
              this.Patient.surname = user.surname;
              this.Patient.birthday = moment(new Date(user.birthday)).format("DD--YYYY");
              this.Patient.birthday = this.Patient.birthday.replace("--", ' ' + this.Months[new Date(user.birthday).getMonth()] + ' ');
              this.Patient.birthdate = moment(new Date(user.birthday)).format('YYYY-MM-DD')
              this.Patient.age = this.getAge(user.birthday);
              this.Patient.work = user.work;
              this.Patient.email = user.email;
              this.Patient.phone = user.phone;
              this.Patient.summary = user.summary;

              if (user.avatar == null) { this.avatar = null }
              else {this.avatar = 'data:image/jpeg;base64,' + user.avatar;}

              axios.get('http://localhost:8000/medications?id=' + this.$route.params.id)
              .then(response => {
                for (const item of Object.values(response.data)) {
                  this.Patient.medication.push(item.medication)
                  this.Patient.originalMedication.push(item.medication)
                }
              });
              axios.get('http://localhost:8000/diagnoses?id=' + this.$route.params.id)
              .then(response => {
                for (const item of Object.values(response.data)) {
                  this.Patient.diagnoses.push(item.diagnosis)
                  this.Patient.originalDiagnoses.push(item.diagnosis)
                }
              })
            }
          });
      }
      else {
          this.Patient.new = true;
          this.edit = true;
          this.Patient.birthdate = "1970-01-01";
          this.Patient.birthday = "01 januari 1970";
        }
    }
  }
</script>