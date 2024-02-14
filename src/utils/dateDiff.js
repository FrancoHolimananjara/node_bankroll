function dateDiffWithWeekEnd(date1,date2) {
	// Initialisation du retour

	// WeekEnd
    const jour = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

	/* Pour la date 1 */
	if (jour[date1.getDay()] == "Sun") {
		date1.setDate(date1.getDate()+1)
		console.log("Date apres weekend pour la date 1 => ",date1);
	}
	if (jour[date1.getDay()] == "Sat") {
		date1.setDate(date1.getDate()+2)
		console.log("Date apres weekend pour la date 1 => ",date1);
	}

	/* Pour la date 2 */
	if (jour[date2.getDay()] == "Sun") {
		date2.setDate(date2.getDate()+1)
		console.log("Date apres weekend our la date 2 => ",date2);
	}
	if (jour[date2.getDay()] == "Sat") {
		date2.setDate(date2.getDate()+2)
		console.log("Date apres weekend our la date 2 => ",date2);
	}
    var tmp = date2 - date1;
	var diff = {};
 
    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
 
    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
 
    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
     
    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;
     
    return diff;
}