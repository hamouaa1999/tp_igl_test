var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    methodOverride = require("method-override");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride("_method"));

var etudiantSchema = new Schema({
    nom: String,
    prenom: String,
    matricule: String
}),
    Etudiant = mongoose.model("etudiants", etudiantSchema);

mongoose.connect("mongodb://localhost/esi_edu_tp");

app.get("/", function(request, response) {
    response.render("test.ejs");
})

/**
 * Recuperer tous les etudiants
 * @function
 */

function getEtudiants(request, response) {
    Etudiant.find({}, function(error, etudiantsTrouves) {
        if (error) {
            console.log("Error in retrieving from the database")
        } else {
            response.send(etudiantsTrouves);
        }
    })
}

app.get("/api/etudiants", getEtudiants)

/**
 * Recuperer un etudiant de la base de données a partir de son matricule
 * @function 
 */

function getEtudiant(request, response) {
    Etudiant.find({matricule: request.params.etudiant}, function(error, etudiant) {
        if (error) {
            console.log(error);
        } else {
            response.send(etudiant);
        }
    })
}
app.get("/api/etudiants/:etudiant", getEtudiant)

/**
 * Ajouter un nouveau etudiant
 * @function
 */

function addEtudiant(request, response) {
    let nouveauEtudiant = new Etudiant({
        nom: request.body.nom,
        prenom: request.body.prenom,
        matricule: request.body.matricule
    })
    nouveauEtudiant.save(function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Fat");
            response.redirect("/api/etudiants");
        }
    })
}

app.post("/api/etudiants/new", addEtudiant)

/**
 * Supprimer un etudiant de la base de données
 * @function
 */

function deleteEtudiant(request, response) {
    Etudiant.findOneAndRemove({matricule: request.body.matric}, function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log("Deleted successfully");
            response.redirect("/api/etudiants");
        }
    })
}

app.delete("/api/etudiants/:etudiant/delete", deleteEtudiant)


app.listen("4001", function() {
    console.log("Server started on port 4001");
})