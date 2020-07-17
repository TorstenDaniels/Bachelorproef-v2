<template>
<v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Vandaag</v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-menu :close-on-content-click="false" nudge-right=40 offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"><v-icon>mdi-calendar</v-icon></v-btn>
                </template>
                <v-date-picker no-title landscape v-model="value" color="#DFB2AD"></v-date-picker>
            </v-menu>
            <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn outlined @click="dialogNew = true">Nieuwe afspraak</v-btn>
        </v-toolbar>
    </v-sheet>
    <v-sheet height="750">
        <v-calendar  @click:event="showEvent" ref="calendar" :weekdays="week" :event-color="getEventColor" v-model="value" :events="selectedEvents" first-time="08:00" interval-height=65 interval-count=10  color="#DFB2AD" type=week :short-weekdays='false'>
                <template #day-body="{ date, week }">
                    <div class="v-current-time" :class="{ first: date === week[0].date }" :style="{ top: nowY }"></div>
                </template>
        </v-calendar>
         <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-y>
                <v-card color="grey lighten-4" flat style="z-index: 2;">
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                    </v-toolbar>
                    <v-card-text v-if="selectedEvent.note != ''">{{ selectedEvent.note }}</v-card-text>
                    <v-card-actions>
                        <v-btn text color="secondary" @click="selectedOpen = false">Terug</v-btn>
                        <router-link v-show="selectedEvent.profile != null" :to="selectedEvent.profile" tag="v-btn"><v-btn text color="secondary" @click="selectedOpen = false">Profiel</v-btn></router-link>
                        <v-spacer></v-spacer>
                        <v-btn text color="red" @click.stop="dialog = true;">Verwijderen</v-btn>
                        <v-dialog v-model="dialog" max-width=590>
                            <v-card>
                                <v-card-title class="headline">Weet u zeker dat u deze afspraak wil verwijderen?</v-card-title>

                                <v-card-text>Deze actie is niet omkeerbaar. Wanneer de afspraak wordt verwijderd is dit definitief.</v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="green" text @click="dialog = false">Annuleren</v-btn>
                                    <v-btn color="red" text @click="deleteEvent(selectedEvent.id)">Verwijderen</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
            </v-menu>
            <v-dialog v-model="dialogNew" max-width=590>
                <v-card>
                    <v-card-title class="headline">Gelieve de gegevens in te vullen voor de afspraak.</v-card-title>
                    <v-card-text>
                        <v-row v-if="newEvent.newUser" style="margin-bottom: -20px">
                            <v-col cols="1"><v-icon style="margin-top: 7px">mdi-account</v-icon></v-col>
                            <v-col cols="4">
                                <v-text-field dense color="#DFB2AD" v-model="newEvent.name" placeholder="Voornaam" filled single-line></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field dense color="#DFB2AD" v-model="newEvent.surname" placeholder="Achternaam" filled single-line></v-text-field>
                            </v-col>
                            <v-col cols="1"><v-tooltip right><template v-slot:activator="{on}"><v-btn v-on="on" icon @click="newEvent.newUser = false"><v-icon style="margin-top: 7px">mdi-book-open</v-icon></v-btn></template><span>Bestaande patiënt</span></v-tooltip></v-col>
                        </v-row>
                        <v-row v-else style="margin-bottom: -20px">
                            <v-col cols="1"><v-icon style="margin-top: 7px">mdi-account</v-icon></v-col>
                            <v-col cols="8"><v-autocomplete v-model="newEvent.patientID" :items="patients" color="#DFB2AD" dense placeholder="Patiënt" filled single-line width=20></v-autocomplete></v-col>
                            <v-col cols="1"><v-tooltip right><template v-slot:activator="{on}"><v-btn v-on="on" icon @click="newEvent.newUser = true"><v-icon style="margin-top: 7px">mdi-plus</v-icon></v-btn></template><span>Nieuwe patiënt</span></v-tooltip></v-col>
                        </v-row>
                        <v-row style="margin-bottom: -20px">
                            <v-col cols="1"><v-icon style="margin-top: 7px">mdi-clock</v-icon></v-col>
                            <v-col cols="3">
                                <v-menu v-model="fromDateMenu" :close-on-content-click="false" :nudge-right="40" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field dense color="#DFB2AD" placeholder="Datum" filled single-line readonly :value="newEvent.date" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker :min="today" color="#DFB2AD" v-model="newEvent.date" @input="fromDateMenu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="3">
                                <v-menu v-model="fromTimeStartMenu" :close-on-content-click="false" :nudge-right="40" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field dense color="#DFB2AD" placeholder="Begin" readonly filled single-line :value="newEvent.start" v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker :max="newEvent.end" format=24hr color="#DFB2AD" v-model="newEvent.start"></v-time-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="3">
                                <v-menu v-model="fromTimeEndMenu" :close-on-content-click="false" :nudge-right="40" offset-y>
                                    <template v-slot:activator="{ on }">
                                        <v-text-field dense color="#DFB2AD" placeholder="Einde" readonly filled single-line :value="newEvent.end" v-on="on"></v-text-field>
                                    </template>
                                    <v-time-picker :min="newEvent.start" format=24hr color="#DFB2AD" v-model="newEvent.end"></v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                        <v-row style="margin-bottom: -20px">
                            <v-col cols="1"><v-icon style="margin-top: 7px">mdi-note</v-icon></v-col>
                            <v-col cols="9">
                                <v-text-field v-model="newEvent.note" clearable color="#DFB2AD" dense placeholder="Notities" filled width=20 clear-icon="mdi-close" @click:clear="clearMessage"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click="resetForm">Annuleren</v-btn>
                        <v-btn v-show="filled()" color="green" text @click="addAppointment">Opslaan</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-sheet>
    </v-col>
  </v-row>
</template>

<!-- Code from vuetify (https://vuetifyjs.com/en/components/calendars/) -->
<style lang="scss">
    .v-current-time {
        height: 2px;
        background-color: #ea4335;
        position: absolute;
        left: -1px;
        right: 0;
        pointer-events: none;

        &.first::before {
            content: '';
            position: absolute;
            background-color: #ea4335;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-top: -5px;
            margin-left: -6.5px;
        }
    }
</style>

<script>
const axios = require('axios');
const moment = require('moment');

  export default {
    data: () => ({
        fromDateMenu: false,
        fromTimeStartMenu: false,
        fromTimeEndMenu: false,
        newEvent: {
            newUser: false,
            name: null,
            surname: null,
            date: null,
            start: null,
            end: null,
            patientID: null,
            note: ''
        },
        today: '',
        currentWeek: 0,
        loaded: [0],
        week: [1,2,3,4,5,6,0],
        selectedEvents: [],
        selectedEvent: {},
        patients: [],
        selectedElement: null,
        selectedOpen: false,
        dialog: false,
        dialogNew: false,
        value: '',
        ready: false,
    }),
    computed: {
      cal () {
        return this.ready ? this.$refs.calendar : null
      },
      nowY () {
        return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
      },
    },
    mounted () {
        this.ready = true
        this.scrollToTime()
        this.updateTime()
        this.$refs.calendar.checkChange()
        this.today = this.$refs.calendar._data.times.now.date

        axios.get('http://localhost:8000/appointments?start=' + this.$refs.calendar._data.lastStart.date + "&end=" + this.$refs.calendar._data.lastEnd.date)
        .then(response => {
            var tmp_events = response.data;

            for (const event of Object.values(tmp_events)) {
                var item = {
                    id: event.id,
                    profile: '/profiel/' + event.patient,
                    name: event.name + " " + event.surname,
                    start: moment(event.begin).format('YYYY-MM-DD HH:mm'),
                    end: moment(event.end).format('YYYY-MM-DD HH:mm'),
                    color: "#DFB2AD",
                    note: event.notities
                }

                this.selectedEvents.push(item);
            }
        });
    },
    methods: {
        resetForm() {
            this.newEvent.note = "";
            this.newEvent.patientID = null;
            this.newEvent.start = null;
            this.newEvent.end = null;
            this.newEvent.date = null;
            this.dialogNew = false;
            this.newEvent.name = null;
            this.newEvent.surname = null;
        },
        clearMessage () {
            this.newEvent.note = ''
        },
        getEventColor (event) {
            return event.color;
        },
        setToday () {
            this.value = ''
        },
        async prev () {
            await this.$refs.calendar.prev()

            this.currentWeek--

            if (this.currentWeek in this.loaded) { return }

            this.loaded.push(this.currentWeek)

            axios.get('http://localhost:8000/appointments?start=' + this.$refs.calendar._data.lastStart.date + "&end=" + this.$refs.calendar._data.lastEnd.date)
            .then(response => {
                var tmp_events = response.data;

                for (const event of Object.values(tmp_events)) {
                    var item = {
                        id: event.id,
                        profile: '/profiel/' + event.patient,
                        name: event.name + " " + event.surname,
                        start: moment(event.begin).format('YYYY-MM-DD HH:mm'),
                        end: moment(event.end).format('YYYY-MM-DD HH:mm'),
                        color: "#DFB2AD",
                        note: event.notities
                    }

                    this.selectedEvents.push(item);
                }
            });
        },
        async next () {
            await this.$refs.calendar.next()

            this.currentWeek++

            if (this.currentWeek in this.loaded) { return }

            this.loaded.push(this.currentWeek)

            axios.get('http://localhost:8000/appointments?start=' + this.$refs.calendar._data.lastStart.date + "&end=" + this.$refs.calendar._data.lastEnd.date)
            .then(response => {
                var tmp_events = response.data;

                for (const event of Object.values(tmp_events)) {
                    var item = {
                        id: event.id,
                        profile: '/profiel/' + event.patient,
                        name: event.name + " " + event.surname,
                        start: moment(event.begin).format('YYYY-MM-DD HH:mm'),
                        end: moment(event.end).format('YYYY-MM-DD HH:mm'),
                        color: "#DFB2AD",
                        note: event.notities
                    }

                    this.selectedEvents.push(item);
                }
            });
        },
        getCurrentTime () {
            return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
        },
        scrollToTime () {
            const time = this.getCurrentTime()
            const first = Math.max(0, time - (time % 30) - 30)

            this.cal.scrollToTime(first)
        },
        updateTime () {
            setInterval(() => this.cal.updateTimes(), 60 * 1000)
        },
        async deleteEvent(id_of_event) {
            axios.post('http://localhost:8000/delete_appointment', { id: id_of_event});
            this.selectedEvents = this.selectedEvents.filter(e => e !== this.selectedEvent);
            this.selectedOpen = false;
        },
        showEvent ({ nativeEvent, event }) {
            const open = () => {
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                setTimeout(() => this.selectedOpen = true, 10)
            }
            
            if (this.selectedOpen) {
                this.selectedOpen = false
                setTimeout(open, 10)
            } else {
                open()
            }

            nativeEvent.stopPropagation()
        },
        zoekNaam(item) {
            return item.value === this.newEvent.patientID
        },
        async addAppointment() {
            await axios.post('http://localhost:8000/create_appointment', { event: this.newEvent});
            await axios.get('http://localhost:8000/get_new_appointment')
            .then(response => {
                var tmp = response.data;
          
                for (const event of Object.values(tmp)) {
                    var item = {
                        id: event.id,
                        profile: '/profiel/' + event.patient,
                        name: event.name + " " + event.surname,
                        start: moment(event.begin).format('YYYY-MM-DD HH:mm'),
                        end: moment(event.end).format('YYYY-MM-DD HH:mm'),
                        color: "#DFB2AD",
                        note: event.notities
                    }

                    this.newEvent.patientID = event.patient;
                    this.selectedEvents.push(item);
                }
            });
            
            if (this.newEvent.newUser) {
                var item = {
                    value: this.newEvent.patientID,
                    text: this.newEvent.name + " " + this.newEvent.surname,
                }

                this.patients.push(item);
            }

            this.newEvent.note = "";
            this.newEvent.patientID = null;
            this.newEvent.start = null;
            this.newEvent.end = null;
            this.newEvent.date = null;
            this.newEvent.name = null;
            this.newEvent.surname = null;
            this.dialogNew = false;
        },
        filled () {
            if (this.newEvent.date && this.newEvent.start && this.newEvent.end)
                return true;
        },
    },
    async created() {
        axios.get('http://localhost:8000/all_patients')
        .then(response => {
            var tmp_persons = response.data;
            
            for (const person of Object.values(tmp_persons)) {
                var item = {
                    value: person.id,
                    text: person.name + " " + person.surname,
                }

                this.patients.push(item);
            }
        });
    }
  }
</script>