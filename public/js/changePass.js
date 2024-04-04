// Fonction pour afficher le formulaire de modification de mot de passe
function showChangePasswordForm() {
    // Afficher le formulaire de modification de mot de passe
    document.getElementById('changePasswordForm').style.display = 'block';
}

// Écouter l'événement de soumission du formulaire de modification de mot de passe
document.getElementById('changePasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le formulaire de soumettre normalement

    // Récupérer les valeurs des champs
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Vérifier si les mots de passe correspondent
    if (newPassword !== confirmNewPassword) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
    }

    // Envoyer une requête POST au serveur pour modifier le mot de passe
    fetch('/api/account/changePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la modification du mot de passe');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Afficher un message de succès
        // Réinitialiser les champs du formulaire
        document.getElementById('oldPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la modification du mot de passe');
    });
});
