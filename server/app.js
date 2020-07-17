const cors = require('cors');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
const moment = require('moment');
var fs = require('fs');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/edit_avatar', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef",
    });
    
    con.connect(function(err) {
        if (err) throw err;

        var query = "UPDATE patients SET `avatar` = ? WHERE id = '" + request.body.id + "';";
        let params = [ request.body.image ];
        con.query(query, params, function(err, result) {
                        if (err) { throw err };
        });
        con.end()
    })
})

app.post('/save_patient', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.connect(function(err) {
        if (err) throw err;
    
        if (!request.body.patient.new) {
            con.query("UPDATE patients " +
                  "SET `surname` = '" + request.body.patient.surname + "', `name` = '" + request.body.patient.firstname + "', `birthday` = '" + moment(new Date(request.body.patient.birthdate)).format("YYYY-MM-DD") + "', `work` = '" + request.body.patient.work + "', `email` = '" + request.body.patient.email + "', `phone` = '" + request.body.patient.phone + "', `summary` = '" + request.body.patient.summary + "' " +
                  "WHERE `patients`.`id` = '" + request.body.patient.id + "'; ", function(err, result) {
            if (err) throw err;
            let differenceM = request.body.patient.medication.filter(x => !request.body.patient.originalMedication.includes(x));
            let differenceD= request.body.patient.diagnoses.filter(x => !request.body.patient.originalDiagnoses.includes(x));
            let deleteM = request.body.patient.originalMedication.filter(x => !request.body.patient.medication.includes(x));
            let deleteD = request.body.patient.originalDiagnoses.filter(x => !request.body.patient.diagnoses.includes(x));

            differenceM.forEach(element => {
                con.query("INSERT INTO medications " +
                    "VALUES ('" + request.body.patient.id + "', '" +  element + "')", function(err, result) {
                if (err) { throw err };
            
            })});
            deleteM.forEach(element => {
                con.query("DELETE FROM medications " +
                    "WHERE id='" + request.body.patient.id + "' and medication='" +  element + "'", function(err, result) {
                if (err) { throw err };
            
            })});
            differenceD.forEach(element => {
                con.query("INSERT INTO diagnoses " +
                    "VALUES ('" + request.body.patient.id + "', '" +  element + "')", function(err, result) {
                if (err) { throw err };
            
            })});
            deleteD.forEach(element => {
                con.query("DELETE FROM diagnoses " +
                    "WHERE id='" + request.body.patient.id + "' and diagnosis='" +  element + "'", function(err, result) {
                if (err) { throw err };
            
            })});

            con.end();
            });
        }
        else {
            con.query("INSERT INTO `patients` (`id`, `avatar`, `surname`, `name`, `birthday`, `work`, `email`, `phone`, `summary`) " +
                  "VALUES (NULL, NULL, '" + request.body.patient.surname + "', '" + request.body.patient.firstname + "', '" + moment(new Date(request.body.patient.birthdate)).format("YYYY-MM-DD") + "', '" + request.body.patient.work + "', '" + request.body.patient.email + "', '" + request.body.patient.phone + "', '" + request.body.patient.summary + "')", function(err, result) {
            if (err) throw err;
            });
                con.query("SELECT MAX(id) 'id'" +
                    "FROM patients ", function(err, result) {
                if (err) throw err;
                
                let differenceM = request.body.patient.medication.filter(x => !request.body.patient.originalMedication.includes(x));
                let differenceD= request.body.patient.diagnoses.filter(x => !request.body.patient.originalDiagnoses.includes(x));
                let deleteM = request.body.patient.originalMedication.filter(x => !request.body.patient.medication.includes(x));
                let deleteD = request.body.patient.originalDiagnoses.filter(x => !request.body.patient.diagnoses.includes(x));

                differenceM.forEach(element => {
                    con.query("INSERT INTO medications " +
                        "VALUES ('" + result[0].id + "', '" +  element + "')", function(err, result) {
                    if (err) { throw err };
                
                })});
                deleteM.forEach(element => {
                    con.query("DELETE FROM medications " +
                        "WHERE id='" + result[0].id + "' and medication='" +  element + "'", function(err, result) {
                    if (err) { throw err };
                
                })});
                differenceD.forEach(element => {
                    con.query("INSERT INTO diagnoses " +
                        "VALUES ('" + result[0].id + "', '" +  element + "')", function(err, result) {
                    if (err) { throw err };
                
                })});
                deleteD.forEach(element => {
                    con.query("DELETE FROM diagnoses " +
                        "WHERE id='" + result[0].id + "' and diagnosis='" +  element + "'", function(err, result) {
                    if (err) { throw err };
                
                })});

                con.end();
            });
        }
    });    
})


app.post('/delete_appointment', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });
    
    con.connect(function(err) {
        if (err) throw err;
    
        con.query("DELETE " +
                  "FROM appointments " +
                  "WHERE id = '" + request.body.id + "'", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
})

app.post('/create_appointment', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });
    
    con.connect(function(err) {
        if (err) throw err;

        if (request.body.event.newUser == true) {
            con.query("INSERT INTO `patients` (`surname`, `name`)" +
                    "VALUES ('" + request.body.event.surname + "', '" + request.body.event.name + "')", function(err, result) {
                if (err) throw err;
            });
            con.query("SELECT MAX(id) 'id' FROM patients", function(err, result) {
                if (err) throw err;
                con.query("INSERT INTO `appointments` (`Patient`, `Begin`, `End`, `Notities`) " +
                "VALUES ('" + result[0].id + "', '" + request.body.event.date + " " + request.body.event.start + "', '" + request.body.event.date + " " + request.body.event.end + "', '" + request.body.event.note +"')", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
            });
            });
        }    

        else { con.query("INSERT INTO `appointments` (`Patient`, `Begin`, `End`, `Notities`) " +
                "VALUES ('" + request.body.event.patientID + "', '" + request.body.event.date + " " + request.body.event.start + "', '" + request.body.event.date + " " + request.body.event.end + "', '" + request.body.event.note +"')", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
            });
        }
    })
})

// Getters 

app.get('/appointments', function (request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });
    
    con.connect(function(err) {
        if (err) throw err;
    
        var lower = request.query.start + ' 00:00:00';
        var upper = request.query.end + ' 23:59:59';
    
        con.query("SELECT appointments.id, patients.id 'patient', begin, end, surname, name, notities " +
                  "FROM appointments " +
                  "LEFT JOIN patients ON appointments.patient = patients.id " +
                  "WHERE begin >= '" + lower + "' AND end <= '" + upper + "'", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
});
app.get('/all_patients_more', function (request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT *" +
                  "FROM patients ", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
});

app.get('/next_appointments', function (request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT Min(Begin) 'begin', Patient " +
                  "FROM appointments " +
                  "WHERE Begin > CURRENT_TIMESTAMP " +
                  "GROUP BY Patient", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
})

app.get('/all_patients_more', function (request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT surname, avatar, id, name" +
                  "FROM patients", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
});

app.get('/get_new_appointment', function (request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });
    
    con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT MAX(appointments.id) 'id', appointments.Patient 'patient', begin, end, surname, name, notities " +
                  "FROM appointments " +
                  "LEFT JOIN patients ON appointments.patient = patients.id " +
                  "WHERE appointments.id = (SELECT MAX(appointments.id) FROM appointments)", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
});

app.get('/get_newest_patient', function (request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });
    
    con.connect(function(err) {
        if (err) throw err;
        
        con.query("SELECT MAX(id) 'id'" +
                  "FROM patients ", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
});

app.get('/todays_appointments', function (requeset, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });
    
    con.connect(function(err) {
        if (err) throw err;
    
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
    
        if (dd < 10) { dd = '0' + dd };
        if (mm < 10) { mm = '0' + mm };
    
        var lower = yyyy + '-' + mm + '-' + dd + ' 00:00:00';
        var upper = yyyy + '-' + mm + '-' + dd + ' 23:59:59';
    
        con.query("SELECT appointments.id, patients.id 'patient', begin, end, surname, name, notities " +
                  "FROM appointments " +
                  "LEFT JOIN patients ON appointments.patient = patients.id " +
                  "WHERE begin >= '" + lower + "' AND end <= '" + upper + "'", function(err, result) {
            if (err) throw err;
            con.end();
            response.send(result)
        });
    })
});

app.get('/profile', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.query(  "SELECT * " +
                "FROM patients " +
                "WHERE id = '" + request.query.id + "'", function(err, result) {
                    if (err) throw err;
                    con.end();
                    response.send(result);
                });
});

app.get('/all_patients', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.query(  "SELECT id, name, surname " +
                "FROM patients ORDER BY surname ASC" , function(err, result) {
                    if (err) throw err;
                    con.end();
                    response.send(result);
                });
});

app.get('/medications', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.query(  "SELECT medication " +
                "FROM medications " +
                "WHERE id = '" + request.query.id + "'", function(err, result) {
                    if (err) throw err;
                    con.end();
                    response.send(result);
                });
});

app.get('/diagnoses', function(request, response) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bachelorproef"
    });

    con.query(  "SELECT diagnosis " +
                "FROM diagnoses " +
                "WHERE id = '" + request.query.id + "'", function(err, result) {
                    if (err) throw err;
                    con.end();
                    response.send(result);
                });
});

app.listen('8000');