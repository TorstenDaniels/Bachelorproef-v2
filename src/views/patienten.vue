<template>
<v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
            <v-autocomplete  clearable v-on:input="selectItem" return-object v-model="selected" v-on:keyup="editList" v-on:blur="blurring" v-on:focus="focussing" ref="selectExample" :items="allItems" color="#DFB2AD" placeholder="Zoek patiënt"></v-autocomplete>
            <v-spacer></v-spacer>
            <v-btn outlined>Nieuwe patiënt</v-btn>
        </v-toolbar>
    </v-sheet>
    <v-list three-line>
      <template v-for="(item, index) in items">
        <v-list-item :key="item.key">
          <v-list-item-avatar v-if="item.avatar == null">
            <v-img src="../assets/avatar.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-avatar v-else>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-row>
                <v-col>
                    <v-list-item-title v-html="item.text"></v-list-item-title>
                    <v-list-item-subtitle><b>Volgende afspraak:</b> {{ item.appointment }} </v-list-item-subtitle>
                </v-col>
                <v-spacer></v-spacer>
                <v-col>
                    <v-btn text outlined class="mx-2">Stress Analyse</v-btn>
                    <v-btn text outlined class="mx-2">Emotie Analyse</v-btn>
                    <router-link :to="item.profile" tag="v-btn"><v-btn text outlined class="mx-2">Profiel</v-btn></router-link>
                </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index" inset></v-divider>
      </template>
    </v-list>
    <v-sheet height="750">
    </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
const axios = require('axios');
const moment = require('moment');

export default {
    data: () => ({
        allItems: [],
        items: [],
        selected: [],
        Months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
    }),
    methods: {
        sortItems(a, b) {
            const checkA = a.surname.toUpperCase();
            const checkB = b.surname.toUpperCase();

            if (checkA > checkB) { return 1 }
            else if (checkA < checkB) { return -1 }
            else { return 0 }
        },
        selectItem() {
            this.items = []
            this.items.push(this.selected)
        },
        editList() {
            this.items = this.$refs.selectExample.filteredItems
        },
        blurring() {
            if (this.items.length == 0) {
                this.items = this.allItems
            }
        },
        focussing() {
            this.items = this.allItems
        }
    },
    async created () {
        var appointments = {}
        axios.get('http://localhost:8000/next_appointments')
                .then(response => {
                     for (const value of Object.values(response.data)) {
                         if (value.begin != null) { appointments[value.Patient] = (moment(new Date(value.begin)).format("DD--YYYY HH:mm")).replace("--", ' ' + this.Months[new Date(value.begin).getMonth()] + ' ') }
                     }
                })

        axios.get('http://localhost:8000/all_patients_more')
        .then(response => {
            var tmp_persons = response.data;
            for (const person of Object.values(tmp_persons)) {
                var item = {
                    key: person.id,
                    text: person.name + " " + person.surname,
                    surname: person.surname,
                    avatar: null,
                    profile: "/profiel/" + person.id,
                    appointment: appointments[person.id]
                }

                if (person.avatar != null) { item.avatar = 'data:image/jpeg;base64,' + btoa(new Uint8Array(person.avatar.data).reduce((data, byte) => data + String.fromCharCode(byte), '')); }

                this.allItems.push(item);
            }

            this.allItems.sort(this.sortItems)
            this.items = this.allItems

        });
    }
}
</script>