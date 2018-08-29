<template>
<div>

  <h4> Notes du développeur </h4>

  <p>Prochaine mise à jour en juin :</p>
  <p>Recherche intelligente de topic supprimés (par titre, auteur etc), archive améliorée, encore plus de stats, amélioration de l'affichage de la liste de topic sur mobile et correction de l'animation</p>
  <p>Technique : Passage à Bootstrap 4 et Postgresql </p>

  <h4> Changelog </h4>
  <ul>
    <li>27/04/2018:
      <ul>
        <li>Prise en compte des restaurations</li>
        <li>Ajout du top 10 des plus gros topics supprimés du jour</li>
        <li>Changement de lien pour Archive.is : Le nouveau lien montre toutes les pages des topics archivés</li>
        <li>Correction d'un bug lors du passage à un nouveau jour (à 23h59) à cause d'un décalage avec l'heure du serveur (à vérifier)</li>
      </ul>
    </li>

    <li>04/04/2018:
      <ul>
        <li>Retour de 410stats après un ban IP</li>
      </ul>
    </li>

    <li>02/04/2018:
      <ul>
        <li>Première beta publique</li>
      </ul>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  plugins: {

  },
  methods: {}

}
</script>
