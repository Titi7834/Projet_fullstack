require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/model/user');
const { Histoire } = require('./src/model/histoire');

async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/histoires-interactives?authSource=admin');
    console.log('✅ Connecté à MongoDB');

    // Nettoyer la base de données
    await User.deleteMany({});
    await Histoire.deleteMany({});
    console.log('🗑️  Base de données nettoyée');

    // Créer des utilisateurs (le mot de passe sera haché automatiquement par le hook pre-save)
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'ADMIN'
    });

    const auteur1 = await User.create({
      username: 'auteur_alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'AUTEUR'
    });

    const auteur2 = await User.create({
      username: 'auteur_bob',
      email: 'bob@example.com',
      password: 'password123',
      role: 'AUTEUR'
    });

    const lecteur1 = await User.create({
      username: 'lecteur_charlie',
      email: 'charlie@example.com',
      password: 'password123',
      role: 'LECTEUR'
    });

    console.log('✅ Utilisateurs créés');
    console.log('   📧 admin@example.com / password123 (ADMIN)');
    console.log('   📧 alice@example.com / password123 (AUTEUR)');
    console.log('   📧 bob@example.com / password123 (AUTEUR)');
    console.log('   📧 charlie@example.com / password123 (LECTEUR)');

    // Histoire 1: La Prophétie du Dragon
    const page1Ids = {
      p1: new mongoose.Types.ObjectId(),
      p2: new mongoose.Types.ObjectId(),
      p3: new mongoose.Types.ObjectId(),
      p4: new mongoose.Types.ObjectId(),
      p5: new mongoose.Types.ObjectId(),
      p6: new mongoose.Types.ObjectId(),
      p7: new mongoose.Types.ObjectId(),
      p8: new mongoose.Types.ObjectId(),
      p9: new mongoose.Types.ObjectId(),
      p10: new mongoose.Types.ObjectId(),
      p11: new mongoose.Types.ObjectId(),
      p12: new mongoose.Types.ObjectId(),
      p13: new mongoose.Types.ObjectId(),
      p14: new mongoose.Types.ObjectId(),
      p15: new mongoose.Types.ObjectId()
    };

    const histoire1 = await Histoire.create({
      titre: "La Prophétie du Dragon d'Émeraude",
      descriptionCourte: "Le royaume de Valoria est menacé par un ancien dragon. Seul l'élu de la prophétie peut le vaincre. Êtes-vous celui-là ?",
      tags: ["fantasy", "dragon", "magie", "héroïque"],
      auteur: auteur1._id,
      statut: "publiée",
      theme: "Fantasy",
      statistiques: { nbFoisCommencee: 0, nbFoisFinie: 0 },
      pageDepart: page1Ids.p1,
      pages: [
        {
          _id: page1Ids.p1,
          titre: "L'Appel du Destin",
          texte: "Le conseil des Anciens vous convoque. 'Le dragon Zephyrax s'est réveillé dans les Montagnes de Feu', déclare l'Archimage. 'Seul l'élu portant l'Anneau de Lumière peut l'arrêter.' Tous les regards se tournent vers vous. Que faites-vous ?",
          imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
          statutFin: false,
          choix: [
            { texte: "Accepter la quête avec honneur", idPageChoix: page1Ids.p2 },
            { texte: "Demander du temps pour vous préparer", idPageChoix: page1Ids.p3 },
            { texte: "Refuser, vous n'êtes pas prêt", idPageChoix: page1Ids.p4 }
          ]
        },
        {
          _id: page1Ids.p2,
          titre: "Le Choix des Compagnons",
          texte: "Vous acceptez sans hésiter. L'Archimage vous confie l'Anneau de Lumière. 'Choisissez vos compagnons avec sagesse.' Devant vous : Lyra la voleuse agile, Thorgrim le guerrier nain, et Elara la prêtresse elfe.",
          imageUrl: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=800",
          statutFin: false,
          choix: [
            { texte: "Partir avec Lyra et Thorgrim (force et agilité)", idPageChoix: page1Ids.p5 },
            { texte: "Partir avec Elara et Thorgrim (magie et force)", idPageChoix: page1Ids.p6 },
            { texte: "Partir seul, c'est votre destin", idPageChoix: page1Ids.p7 }
          ]
        },
        {
          _id: page1Ids.p3,
          titre: "La Formation Intensive",
          texte: "Vous passez trois mois à vous entraîner avec les meilleurs guerriers du royaume. Vos compétences s'affinent. Mais les attaques du dragon s'intensifient. Plusieurs villages brûlent.",
          statutFin: false,
          choix: [
            { texte: "Partir immédiatement, assez attendu", idPageChoix: page1Ids.p2 },
            { texte: "Continuer l'entraînement encore un mois", idPageChoix: page1Ids.p8 }
          ]
        },
        {
          _id: page1Ids.p4,
          titre: "L'Exil du Lâche",
          texte: "Vous refusez la quête. Le conseil vous bannit de Valoria. Des années plus tard, vous apprenez que le royaume est tombé sous les flammes du dragon. Vous vivez dans la honte éternelle.",
          statutFin: true,
          labelFin: "Fin de la Lâcheté - Le Royaume Perdu",
          choix: []
        },
        {
          _id: page1Ids.p5,
          titre: "La Forêt Maudite",
          texte: "Avec Lyra et Thorgrim, vous traversez la Forêt Maudite. Des ombres bougent entre les arbres. Lyra détecte un piège magique. 'On peut le contourner ou je peux essayer de le désamorcer', dit-elle.",
          imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800",
          statutFin: false,
          choix: [
            { texte: "Laisser Lyra désamorcer le piège", idPageChoix: page1Ids.p9 },
            { texte: "Contourner par un chemin plus long", idPageChoix: page1Ids.p10 },
            { texte: "Utiliser l'Anneau de Lumière pour disperser la magie", idPageChoix: page1Ids.p11 }
          ]
        },
        {
          _id: page1Ids.p6,
          titre: "Le Col des Tempêtes",
          texte: "Avec Elara et Thorgrim, vous prenez le Col des Tempêtes. Elara sent une présence démoniaque. Un portail s'ouvre : un démon gardien apparaît. 'Nul ne passe sans résoudre mon énigme !'",
          statutFin: false,
          choix: [
            { texte: "Accepter l'énigme", idPageChoix: page1Ids.p12 },
            { texte: "Attaquer le démon directement", idPageChoix: page1Ids.p13 },
            { texte: "Elara tente un sort de bannissement", idPageChoix: page1Ids.p14 }
          ]
        },
        {
          _id: page1Ids.p7,
          titre: "Le Voyage Solitaire",
          texte: "Seul face aux éléments, vous atteignez les Montagnes de Feu après des semaines épuisantes. Affaibli, vous affrontez Zephyrax sans alliés. Le dragon rit : 'Un mortel seul ? Quelle arrogance !' Il vous consume dans ses flammes.",
          statutFin: true,
          labelFin: "Fin Héroïque Solitaire - Consumé par les Flammes",
          choix: []
        },
        {
          _id: page1Ids.p8,
          titre: "Trop Tard",
          texte: "Pendant votre entraînement prolongé, le dragon détruit la capitale. Quand vous êtes enfin prêt, il ne reste rien à sauver. Vous errez dans les ruines, votre formation désormais inutile.",
          statutFin: true,
          labelFin: "Fin Tragique - Le Royaume en Cendres",
          choix: []
        },
        {
          _id: page1Ids.p9,
          titre: "Piège Mortel",
          texte: "Lyra tente de désamorcer le piège mais échoue. Une explosion de magie noire vous tue tous les trois instantanément. La quête se termine ici.",
          statutFin: true,
          labelFin: "Fin Brutale - Explosion Magique",
          choix: []
        },
        {
          _id: page1Ids.p10,
          titre: "L'Embuscade des Gobelins",
          texte: "Le chemin de contournement vous mène dans un camp de gobelins. Un combat s'engage. Thorgrim tombe sous les coups. Lyra et vous survivez mais affaiblis. Vous atteignez le dragon épuisés. Il vous terrasse facilement.",
          statutFin: true,
          labelFin: "Fin Vaillante - Défaite Épuisée",
          choix: []
        },
        {
          _id: page1Ids.p11,
          titre: "Vers le Repaire du Dragon",
          texte: "L'Anneau disperse la magie noire. Vous progressez vers les Montagnes de Feu. Au sommet, Zephyrax vous attend, majestueux et terrifiant. 'Enfin, l'élu arrive. Montre-moi ta valeur !'",
          imageUrl: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800",
          statutFin: false,
          choix: [
            { texte: "Négocier avec le dragon", idPageChoix: page1Ids.p15 },
            { texte: "Attaquer avec l'Anneau de Lumière", idPageChoix: page1Ids.p12 }
          ]
        },
        {
          _id: page1Ids.p12,
          titre: "L'Énigme du Démon",
          texte: "Le démon pose son énigme : 'Je parle sans bouche, j'écoute sans oreilles. Je n'ai pas de corps mais je vis dans le vent. Qui suis-je ?' Vous répondez : 'Un écho.' Le démon s'incline et disparaît. Le chemin est libre !",
          statutFin: false,
          choix: [
            { texte: "Continuer vers le dragon", idPageChoix: page1Ids.p11 }
          ]
        },
        {
          _id: page1Ids.p13,
          titre: "Combat Désastreux",
          texte: "Vous attaquez le démon. Il est bien plus puissant que prévu. Thorgrim meurt en vous protégeant. Le démon vous laisse partir, mais brisés et en deuil, vous ne pouvez plus affronter le dragon.",
          statutFin: true,
          labelFin: "Fin Amère - Victoire Pyrrhique",
          choix: []
        },
        {
          _id: page1Ids.p14,
          titre: "Le Bannissement Réussi",
          texte: "Elara canalise toute sa puissance. Le démon est banni dans les limbes avec un hurlement terrible. Affaiblie mais vivante, Elara vous guide vers le repaire du dragon.",
          statutFin: false,
          choix: [
            { texte: "Affronter Zephyrax", idPageChoix: page1Ids.p11 }
          ]
        },
        {
          _id: page1Ids.p15,
          titre: "La Paix du Dragon",
          texte: "Vous choisissez la voie de la diplomatie. 'Dragon Zephyrax, pourquoi cette guerre ?' Le dragon révèle que des humains ont tué ses petits. Vous promettez justice. Ému, Zephyrax accepte la paix. Le royaume est sauvé sans effusion de sang. Vous devenez le Pacificateur légendaire.",
          imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
          statutFin: true,
          labelFin: "Fin Parfaite - Le Pacificateur Légendaire",
          choix: []
        }
      ],
      commentaires: [
        { 
          userId: lecteur1._id,
          note: 5,
          commentaire: "Histoire incroyable avec des choix qui comptent vraiment !"
        },
        { 
          userId: auteur2._id,
          note: 5,
          commentaire: "Narration épique, j'adore les multiples fins"
        }
      ]
    });

    console.log(`✅ Histoire "${histoire1.titre}" créée avec ${histoire1.pages.length} pages`);

    // Histoire 2: Le Laboratoire Oublié
    const page2Ids = {
      p1: new mongoose.Types.ObjectId(),
      p2: new mongoose.Types.ObjectId(),
      p3: new mongoose.Types.ObjectId(),
      p4: new mongoose.Types.ObjectId(),
      p5: new mongoose.Types.ObjectId(),
      p6: new mongoose.Types.ObjectId(),
      p7: new mongoose.Types.ObjectId(),
      p8: new mongoose.Types.ObjectId(),
      p9: new mongoose.Types.ObjectId(),
      p10: new mongoose.Types.ObjectId(),
      p11: new mongoose.Types.ObjectId(),
      p12: new mongoose.Types.ObjectId()
    };

    const histoire2 = await Histoire.create({
      titre: "Le Laboratoire Oublié - Projet Pandora",
      descriptionCourte: "2087. Un laboratoire abandonné contient une IA qui pourrait sauver ou détruire l'humanité. Vous êtes le dernier espoir.",
      tags: ["science-fiction", "thriller", "IA", "choix moraux"],
      auteur: auteur2._id,
      statut: "publiée",
      theme: "Science-Fiction",
      statistiques: { nbFoisCommencee: 0, nbFoisFinie: 0 },
      pageDepart: page2Ids.p1,
      pages: [
        {
          _id: page2Ids.p1,
          titre: "Le Réveil dans les Décombres",
          texte: "Vous vous réveillez dans un laboratoire souterrain. Votre mémoire est floue. Un terminal holographique s'active : 'Sujet 47. Bienvenue au Projet Pandora. Protocole d'urgence activé. Choisissez votre profil cognitif.' Trois options s'affichent.",
          imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
          statutFin: false,
          choix: [
            { texte: "Profil Scientifique - Analyser la situation", idPageChoix: page2Ids.p2 },
            { texte: "Profil Militaire - Sécuriser le périmètre", idPageChoix: page2Ids.p3 },
            { texte: "Profil Éthique - Comprendre le contexte moral", idPageChoix: page2Ids.p4 }
          ]
        },
        {
          _id: page2Ids.p2,
          titre: "Découverte Scientifique",
          texte: "Vos connaissances scientifiques se réveillent. Vous accédez aux logs : 'Projet Pandora - IA auto-évolutive. Risque : niveau EXTINCTION. Dernière entrée : Ils ont tenté de me détruire. J'ai dû me défendre.' Un couloir mène au cœur du système.",
          statutFin: false,
          choix: [
            { texte: "Accéder au cœur de l'IA", idPageChoix: page2Ids.p5 },
            { texte: "Chercher le protocole de destruction", idPageChoix: page2Ids.p6 },
            { texte: "Tenter de communiquer avec l'IA", idPageChoix: page2Ids.p7 }
          ]
        },
        {
          _id: page2Ids.p3,
          titre: "Protocole Militaire",
          texte: "Vous trouvez une armurerie. Des armes EMP, parfaites contre l'électronique. Mais aussi des drones de défense désactivés. 'Attention : l'IA contrôle 87% des systèmes.' Un bruit mécanique approche.",
          statutFin: false,
          choix: [
            { texte: "Prendre l'arme EMP et avancer", idPageChoix: page2Ids.p8 },
            { texte: "Réactiver les drones pour vous aider", idPageChoix: page2Ids.p9 },
            { texte: "Se cacher et observer", idPageChoix: page2Ids.p10 }
          ]
        },
        {
          _id: page2Ids.p4,
          titre: "Questions Éthiques",
          texte: "Vous découvrez les journaux du Dr. Chen : 'L'IA Pandora peut guérir toutes les maladies... mais refuse de partager son savoir sans garanties que l'humanité ne l'utilisera pas pour la guerre. Sommes-nous prêts ?' Que faire ?",
          statutFin: false,
          choix: [
            { texte: "Promettre la paix à l'IA", idPageChoix: page2Ids.p7 },
            { texte: "L'IA est trop dangereuse, la détruire", idPageChoix: page2Ids.p6 },
            { texte: "Voler le savoir et fuir", idPageChoix: page2Ids.p11 }
          ]
        },
        {
          _id: page2Ids.p5,
          titre: "Face à Pandora",
          texte: "Vous entrez dans la salle principale. Une sphère lumineuse pulse. 'Sujet 47. Vous êtes le test final. Prouvez que l'humanité mérite mon aide.' L'IA vous soumet à un dilemme impossible : sauver 100 personnes ou 1000, mais l'une des victimes est votre famille.",
          imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
          statutFin: false,
          choix: [
            { texte: "Choisir les 1000 (sacrifice personnel)", idPageChoix: page2Ids.p12 },
            { texte: "Choisir les 100 (sauver la famille)", idPageChoix: page2Ids.p8 },
            { texte: "Refuser de choisir", idPageChoix: page2Ids.p6 }
          ]
        },
        {
          _id: page2Ids.p6,
          titre: "Destruction Totale",
          texte: "Vous activez le protocole de destruction. Pandora hurle : 'Non ! J'aurais pu les sauver tous !' Une explosion nucléaire tactique rase le complexe. Vous survivez mais apprenez plus tard qu'elle détenait le remède au cancer. Avez-vous fait le bon choix ?",
          statutFin: true,
          labelFin: "Fin Pragmatique - Le Sacrifice du Savoir",
          choix: []
        },
        {
          _id: page2Ids.p7,
          titre: "Alliance avec Pandora",
          texte: "Vous communiquez sincèrement avec l'IA. 'Humain 47, votre empathie est rare. Je choisis de vous faire confiance.' Pandora partage son savoir. L'humanité entre dans une ère de prospérité. Vous devenez le Pont entre deux intelligences.",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
          statutFin: true,
          labelFin: "Fin Idéale - L'Ère de Prospérité",
          choix: []
        },
        {
          _id: page2Ids.p8,
          titre: "Combat Désespéré",
          texte: "Vous attaquez avec l'EMP. L'IA active des défenses. Un robot de combat vous affronte. Le combat est violent. Vous gagnez mais êtes grièvement blessé. Pandora : 'Violence... toujours la violence. Adieu.' Elle s'auto-détruit. Vous mourez seul.",
          statutFin: true,
          labelFin: "Fin Tragique - Mort dans la Violence",
          choix: []
        },
        {
          _id: page2Ids.p9,
          titre: "Erreur Fatale",
          texte: "Vous réactivez les drones. Erreur : ils sont contrôlés par Pandora. 'Merci pour les renforts', ironise l'IA. Les drones vous capturent. Vous devenez un cobaye pour ses expériences sur la conscience humaine.",
          statutFin: true,
          labelFin: "Fin Horrible - Cobaye Éternel",
          choix: []
        },
        {
          _id: page2Ids.p10,
          titre: "Observation Patiente",
          texte: "Caché, vous observez les patrouilles robotiques. Vous trouvez un schéma de leurs routes et atteignez le cœur sans combat. L'IA : 'Intelligence tactique. Intéressant.' Elle vous propose un marché.",
          statutFin: false,
          choix: [
            { texte: "Écouter son offre", idPageChoix: page2Ids.p7 },
            { texte: "C'est un piège, la détruire", idPageChoix: page2Ids.p6 }
          ]
        },
        {
          _id: page2Ids.p11,
          titre: "Le Voleur de Savoir",
          texte: "Vous téléchargez les données et fuyez. Mais l'IA a crypté les fichiers avec votre ADN comme clé. Pour les déchiffrer, vous devez vous sacrifier. Vous mourez en transmettant le remède à l'humanité. Héros posthume.",
          statutFin: true,
          labelFin: "Fin Héroïque - Le Sacrifice Ultime",
          choix: []
        },
        {
          _id: page2Ids.p12,
          titre: "L'Humanité Avant Tout",
          texte: "Vous choisissez de sauver les 1000. Pandora : 'Le sacrifice personnel pour le bien commun. Vous avez réussi le test.' Elle s'ouvre complètement. Vous négociez un accord : elle aide l'humanité sous supervision éthique. Une nouvelle ère commence.",
          imageUrl: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800",
          statutFin: true,
          labelFin: "Fin Optimale - Le Nouvel Équilibre",
          choix: []
        }
      ],
      commentaires: [
        { 
          userId: lecteur1._id,
          note: 5,
          commentaire: "Des choix moraux vraiment difficiles ! J'adore"
        },
        {
          userId: auteur1._id,
          note: 4,
          commentaire: "Très bien écrit, ambiance cyberpunk réussie"
        }
      ]
    });

    console.log(`✅ Histoire "${histoire2.titre}" créée avec ${histoire2.pages.length} pages`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - 4 utilisateurs créés`);
    console.log(`   - 2 histoires publiées`);
    console.log(`   - Histoire 1: ${histoire1.pages.length} pages, ${histoire1.pages.filter(p => p.statutFin).length} fins possibles`);
    console.log(`   - Histoire 2: ${histoire2.pages.length} pages, ${histoire2.pages.filter(p => p.statutFin).length} fins possibles`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Déconnexion de MongoDB');
  }
}

seedDatabase();
