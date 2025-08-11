# À propos de l'application Carte Mentale

- Licence : [AGPL v3](http://www.gnu.org/licenses/agpl.txt) - Copyright Edifice, Région Hauts-de-France
- Développeur(s) : Edifice 
- Financeur(s) : Edifice, Région Hauts-de-France
- Description : Application de conception de carte mentale. L'application permet de construire en ligne une carte mentale, de la partager et de l'exporter. Elle s'appuie sur une librairie issue de http://www.wisemapping.com/.

# Documentation technique

## Build

<pre>
    yarn build
    gradle install
</pre>

## Construction

<pre>
		gradle copyMod
</pre>

## Déployer dans ent-core

## Configuration

Dans le fichier `/mindmap/deployment/mindmap/conf.json.template` :

Déclarer l'application dans la liste :

<pre>
{
  "name": "net.atos~mindmap~0.2.0",
  "config": {
    "main" : "net.atos.entng.mindmap.Mindmap",
    "port" : 8666,
    "app-name" : "Mindmap",
    "app-address" : "/mindmap",
    "app-icon" : "mindmap-large",
    "host": "${host}",
    "ssl" : $ssl,
    "userbook-host": "${host}",
    "integration-mode" : "HTTP",
    "app-registry.port" : 8012,
    "mode" : "${mode}",
    "entcore.port" : 8009
  }
}
</pre>

Associer une route d'entée à la configuration du module proxy intégré (`"name": "net.atos~mindmap~0.2.0"`) :

<pre>
{
  "location": "/mindmap",
  "proxy_pass": "http://localhost:8666"
}
</pre>

# Présentation du module

## Fonctionnalités

La Carte Mentale permet d’organiser des idées, des concepts, des prises de notes sous forme d'un schéma permettant de représenter le fonctionnement de la pensée.

Des permissions sur les différentes actions possibles sur les cartes mentales, dont la contribution et la gestion, sont configurées dans les cartes mentales (via des partages Ent-core).
Le droit de lecture, correspondant à qui peut consulter la carte mentale est également configuré de cette manière.

La Carte Mentale met en œuvre un comportement de recherche sur le nom et la description des cartes.

## Modèle de persistance

Les données du module sont stockées dans une collection Mongo "mindmap".

## Modèle serveur

Le module serveur utilise un contrôleur de déclaration :

- `MindmapController` : Point d'entrée à l'application, Routage des vues, sécurité globale et déclaration de l'ensemble des comportements relatifs aux cartes mentales (liste, création, modification, destruction, export et partage)

Le contrôleur étend les classes du framework Ent-core exploitant les CrudServices de base.

Le module serveur met en œuvre deux évènements issus du framework Ent-core :

- `MindmapRepositoryEvents` : Logique de changement d'année scolaire
- `MindmapSearchingEvents` : Logique de recherche

Un jsonschema permet de vérifier les données reçues par le serveur, il se trouve dans le dossier "src/main/resources/jsonschema".

## Modèle front-end

Le modèle Front-end manipule un objet model :

- `Mindmaps` : Correspondant aux cartes mentales

Il y a une collection globale :

- `model.mindmaps.all` qui contient l'ensemble des objets `mindmap` synchronisé depuis le serveur.
