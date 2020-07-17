<template>
<v-container>
    <h1 style="text-align: center">Hallo Torsten Daniels</h1>
    <v-row>
        <v-col>
            <h2 v-if="selectedEvents.length == 1" style="text-align: center">U heeft vandaag 1 afspraak</h2>
            <h2 v-else style="text-align: center">U heeft vandaag {{ selectedEvents.length }} afspraken</h2>
            <v-calendar @click:event="showEvent" :event-color="getEventColor" v-model="value" :events="selectedEvents" first-time="08:00" interval-height=62 interval-count=10 color="#DFB2AD" type="day" present=true />
            <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-y
                >
                <v-card color="grey lighten-4" flat style="z-index: 2;">
                    <v-toolbar :color="selectedEvent.color" dark>
                        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                    </v-toolbar>
                    <v-card-text v-if="selectedEvent.note != ''">{{ selectedEvent.note }}</v-card-text>
                    <v-card-actions>
                        <v-btn text color="secondary" @click="selectedOpen = false">Terug</v-btn>
                        <router-link :to="selectedEvent.profile" tag="v-btn"><v-btn text color="secondary" @click="selectedOpen = false">Profiel</v-btn></router-link>
                        <v-spacer></v-spacer>
                        <v-btn text color="red" @click.stop="dialog = true;">Verwijderen</v-btn>
                        <v-dialog v-model="dialog" max-width=590>
                            <v-card>
                                <v-card-title class="headline">Weet u zeker dat u deze afspraak wil verwijderen?</v-card-title>

                                <v-card-text>
                                Deze actie is niet omkeerbaar. Wanneer de afspraak wordt verwijderd is dit definitief.
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn color="green" text @click="dialog = false">Nee</v-btn>
                                    <v-btn color="red" text @click="deleteEvent(selectedEvent.id)">Verwijderen</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-card>
                </v-menu>
        </v-col>
        <v-col>
            <h2 style="text-align: center">7 notificaties</h2>
        </v-col>
    </v-row>
    </v-container>
</template>

<script>
const axios = require('axios');
const moment = require('moment');

export default {
    data: () => ({
        selectedEvents: [],
        value: '',
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        dialog: false,
    }),

    methods: {
        getEventColor (event) {
            return event.color;
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
    },

    async created() {
        axios.get('http://localhost:8000/todays_appointments')
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
    }
}
</script>