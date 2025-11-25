require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

    // Créer des utilisateurs
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    const auteur1 = await User.create({
      username: 'auteur_alice',
      email: 'alice@example.com',
      password: hashedPassword,
      role: 'AUTEUR'
    });

    const auteur2 = await User.create({
      username: 'auteur_bob',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'AUTEUR'
    });

    const lecteur1 = await User.create({
      username: 'lecteur_charlie',
      email: 'charlie@example.com',
      password: hashedPassword,
      role: 'LECTEUR'
    });

    console.log('✅ Utilisateurs créés');
    console.log('   📧 admin@example.com / password123 (ADMIN)');
    console.log('   📧 alice@example.com / password123 (AUTEUR)');
    console.log('   📧 bob@example.com / password123 (AUTEUR)');
    console.log('   📧 charlie@example.com / password123 (LECTEUR)');

    // Histoire 1: L'Île aux Mystères
    const page1Ids = {
      p1: new mongoose.Types.ObjectId(),
      p2: new mongoose.Types.ObjectId(),
      p3: new mongoose.Types.ObjectId(),
      p4: new mongoose.Types.ObjectId(),
      p5: new mongoose.Types.ObjectId(),
      p6: new mongoose.Types.ObjectId(),
      p7: new mongoose.Types.ObjectId(),
      p8: new mongoose.Types.ObjectId()
    };

    const histoire1 = await Histoire.create({
      titre: "L'Île aux Mystères",
      descriptionCourte: "Vous vous réveillez sur une île inconnue après un naufrage. Explorez ses secrets et tentez de survivre.",
      tags: ["aventure", "mystère", "survie"],
      auteur: auteur1._id,
      statut: "publiée",
      theme: "Aventure",
      statistiques: { nbFoisCommencee: 45, nbFoisFinie: 32 },
      pageDepart: page1Ids.p1,
      pages: [
        {
          _id: page1Ids.p1,
          texte: "Vous vous réveillez sur une plage déserte. Des débris de votre navire jonchent le sable. Que faites-vous ?",
          statutFin: false,
          choix: [
            { texte: "Explorer la plage", idPageChoix: page1Ids.p2 },
            { texte: "Partir vers la jungle", idPageChoix: page1Ids.p3 }
          ]
        },
        {
          _id: page1Ids.p2,
          texte: "Vous trouvez un couteau et une gourde. Au loin, une grotte...",
          statutFin: false,
          choix: [
            { texte: "Aller à la grotte", idPageChoix: page1Ids.p4 },
            { texte: "Chercher de l'eau", idPageChoix: page1Ids.p5 }
          ]
        },
        {
          _id: page1Ids.p3,
          texte: "La jungle est dense. Vous trouvez une cascade avec de l'eau potable.",
          statutFin: false,
          choix: [
            { texte: "Boire de l'eau", idPageChoix: page1Ids.p6 },
            { texte: "Explorer plus loin", idPageChoix: page1Ids.p7 }
          ]
        },
        {
          _id: page1Ids.p4,
          texte: "Dans la grotte, vous trouvez un abri sûr. Vous survivez jusqu'au sauvetage !",
          statutFin: true,
          choix: []
        },
        {
          _id: page1Ids.p5,
          texte: "Vous trouvez une source d'eau et construisez un campement. Sauvé !",
          statutFin: true,
          choix: []
        },
        {
          _id: page1Ids.p6,
          texte: "L'eau était contaminée. Vous tombez malade... Game Over.",
          statutFin: true,
          choix: []
        },
        {
          _id: page1Ids.p7,
          texte: "Vous découvrez des ruines anciennes avec des provisions. Vous survivez !",
          statutFin: true,
          choix: []
        },
        {
          _id: page1Ids.p8,
          texte: "Vous vous perdez dans la jungle... Game Over.",
          statutFin: true,
          choix: []
        }
      ],
      commentaires: [
        { commentaires: "Super histoire !", notes: 5 },
        { commentaires: "Très immersif", notes: 4 }
      ]
    });

    console.log(`✅ Histoire "${histoire1.titre}" créée avec ${histoire1.pages.length} pages`);

    // Histoire 2: Le Manoir Hanté
    const page2Ids = {
      p1: new mongoose.Types.ObjectId(),
      p2: new mongoose.Types.ObjectId(),
      p3: new mongoose.Types.ObjectId(),
      p4: new mongoose.Types.ObjectId(),
      p5: new mongoose.Types.ObjectId()
    };

    const histoire2 = await Histoire.create({
      titre: "Le Manoir Hanté de Blackwood",
      descriptionCourte: "Une nuit dans un manoir hanté pour gagner un million. Osez-vous ?",
      tags: ["horreur", "fantastique", "suspense"],
      auteur: auteur2._id,
      statut: "publiée",
      theme: "Horreur",
      statistiques: { nbFoisCommencee: 78, nbFoisFinie: 45 },
      pageDepart: page2Ids.p1,
      pages: [
        {
          _id: page2Ids.p1,
          texte: "Minuit. Vous entrez dans le manoir Blackwood. Un escalier monte à l'étage, une porte s'ouvre sur un salon.",
          statutFin: false,
          choix: [
            { texte: "Monter l'escalier", idPageChoix: page2Ids.p2 },
            { texte: "Explorer le salon", idPageChoix: page2Ids.p3 }
          ]
        },
        {
          _id: page2Ids.p2,
          texte: "À l'étage, des portraits vous observent. Une lumière vacille sous une porte.",
          statutFin: false,
          choix: [
            { texte: "Ouvrir la porte", idPageChoix: page2Ids.p4 },
            { texte: "Fuir", idPageChoix: page2Ids.p5 }
          ]
        },
        {
          _id: page2Ids.p3,
          texte: "Le salon révèle un journal intime. Vous découvrez la vérité sur la famille et levez la malédiction. Vous gagnez le million !",
          statutFin: true,
          choix: []
        },
        {
          _id: page2Ids.p4,
          texte: "Un fantôme apparaît... Votre cœur lâche. Game Over.",
          statutFin: true,
          choix: []
        },
        {
          _id: page2Ids.p5,
          texte: "Vous survivez jusqu'au matin, traumatisé mais riche !",
          statutFin: true,
          choix: []
        }
      ],
      commentaires: [
        { commentaires: "Flippant !", notes: 5 }
      ]
    });

    console.log(`✅ Histoire "${histoire2.titre}" créée avec ${histoire2.pages.length} pages`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - 4 utilisateurs créés`);
    console.log(`   - 2 histoires publiées`);

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Déconnexion de MongoDB');
  }
}

seedDatabase();
