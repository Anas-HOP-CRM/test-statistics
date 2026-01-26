// DATA FILE - reportData for BugReportGenerator
const reportData = {
  title: "Rapport des Tests",
  subtitle: "Écarts entre les tests unitaires et les problèmes rencontrés",
  sections: [
    {
      title: "Problèmes Testables",
      items: [
        {
          title: "Bouton 'Ajouter une condition' : ne fonctionne pas",
          description: "",
          reasons: [
            "On a pas fait le test pour ce button \"Ajouter <DomainName>\"",
            "ConditionCrudTest → Ajouter une condition n'est pas implémenté"
          ],
          subItems: []
        },
        {
          title: "Le nom de la vue liste n'est pas affiché",
          description: "",
          reasons: ["BaseTest → \"vue_liste_id\" n'est pas dans validation rules de form request. n'est pas implémenté"],
          subItems: []
        },
        {
          title: "Bug quand je veux modifier le type de champ : le champ est dupliqué au lieu d'être modifié",
          description: "",
          reasons: [
            "On n'a pas fait le test de modification du type de champ",
            "ChampCrudTest → \"Modifier le type de champ\" n'est pas implémenté"
          ],
          subItems: []
        }
      ]
    }
  ]
};

export default reportData;
