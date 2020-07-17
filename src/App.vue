<template>
  <v-app>
    <v-app-bar app color="#DFB2AD" light>
      <router-link to="/" tag="v-btn"><v-btn style="height: 64px" :ripple="false" text><v-img class="mx-10" src="./assets/logo.png" max-width="150" contain/></v-btn></router-link>
      <v-spacer/>
        <router-link to="/agenda" tag="v-btn" style="margin-left: -250px"><v-btn style="height: 64px" text>Agenda</v-btn></router-link>
        <v-divider vertical color="#B2A8A8" />
        <router-link to="/analyse" tag="v-btn"><v-btn style="height: 64px" text>Analyse</v-btn></router-link>
        <v-divider vertical color="#B2A8A8" />
        <router-link to="/patienten" tag="v-btn"><v-btn style="height: 64px" text>Patiënten</v-btn></router-link>
      <v-spacer/>
    </v-app-bar>

    <v-container style="margin-top: 80px;">
      <router-view />
    </v-container>
  </v-app>
</template>