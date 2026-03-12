/**
 * skillTaxonomy.js
 * Canonical skill names (keys) mapped to known variants / aliases.
 * All values are lowercase — matching is done case-insensitively.
 */
const skillTaxonomy = {
  // ── JavaScript ecosystem ──────────────────────────────────────────────
  'JavaScript': ['javascript', 'js', 'vanilla js', 'vanillajs', 'es6', 'es2015', 'ecmascript'],
  'TypeScript': ['typescript', 'ts'],
  'React': ['react', 'reactjs', 'react.js'],
  'Next.js': ['next.js', 'nextjs', 'next js'],
  'Vue.js': ['vue', 'vue.js', 'vuejs'],
  'Angular': ['angular', 'angularjs', 'angular.js'],
  'Node.js': ['node', 'node.js', 'nodejs'],
  'Express.js': ['express', 'express.js', 'expressjs'],
  'Redux': ['redux', 'react-redux', 'redux toolkit', 'rtk'],
  'GraphQL': ['graphql', 'graph ql'],
  'jQuery': ['jquery', 'jquery.js'],

  // ── Python ecosystem ──────────────────────────────────────────────────
  'Python': ['python', 'python3', 'py'],
  'Django': ['django', 'django rest framework', 'drf'],
  'Flask': ['flask'],
  'FastAPI': ['fastapi', 'fast api'],
  'Pandas': ['pandas', 'pd'],
  'NumPy': ['numpy', 'np'],
  'Scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
  'TensorFlow': ['tensorflow', 'tf', 'tensor flow'],
  'PyTorch': ['pytorch', 'torch', 'py torch'],
  'Keras': ['keras'],

  // ── Mobile ────────────────────────────────────────────────────────────
  'React Native': ['react native', 'react-native', 'rn'],
  'Flutter': ['flutter', 'dart flutter'],
  'Dart': ['dart'],
  'Swift': ['swift', 'swiftui'],
  'Kotlin': ['kotlin'],
  'Android': ['android', 'android development', 'android sdk'],
  'iOS': ['ios', 'ios development', 'xcode'],

  // ── Databases ─────────────────────────────────────────────────────────
  'MongoDB': ['mongodb', 'mongo', 'mongoose'],
  'PostgreSQL': ['postgresql', 'postgres', 'pg'],
  'MySQL': ['mysql'],
  'SQLite': ['sqlite', 'sqlite3'],
  'Redis': ['redis'],
  'Firebase': ['firebase', 'firestore'],
  'Elasticsearch': ['elasticsearch', 'elastic search'],
  'SQL': ['sql', 'structured query language'],

  // ── DevOps / Cloud ────────────────────────────────────────────────────
  'Docker': ['docker', 'dockerfile', 'docker compose', 'docker-compose'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'AWS': ['aws', 'amazon web services', 'amazon aws'],
  'Azure': ['azure', 'microsoft azure'],
  'GCP': ['gcp', 'google cloud', 'google cloud platform'],
  'CI/CD': ['ci/cd', 'ci cd', 'continuous integration', 'continuous deployment', 'github actions', 'gitlab ci'],
  'Linux': ['linux', 'ubuntu', 'debian', 'bash', 'shell scripting'],
  'Nginx': ['nginx'],
  'Terraform': ['terraform'],

  // ── Design / Frontend ─────────────────────────────────────────────────
  'Tailwind CSS': ['tailwind', 'tailwind css', 'tailwindcss'],
  'CSS': ['css', 'css3'],
  'HTML': ['html', 'html5'],
  'SCSS': ['scss', 'sass'],
  'Bootstrap': ['bootstrap'],
  'Figma': ['figma'],
  'Adobe XD': ['adobe xd', 'xd'],
  'Photoshop': ['photoshop', 'adobe photoshop'],
  'UI/UX Design': ['ui/ux', 'ui ux', 'user interface', 'user experience', 'ux design', 'ui design'],

  // ── Version control / tools ───────────────────────────────────────────
  'Git': ['git', 'git version control'],
  'GitHub': ['github'],
  'GitLab': ['gitlab'],
  'REST API': ['rest', 'rest api', 'restful', 'restful api'],
  'WebSocket': ['websocket', 'web socket', 'ws'],
  'GraphQL': ['graphql', 'graph ql'],

  // ── Data & Analytics ──────────────────────────────────────────────────
  'Machine Learning': ['machine learning', 'ml'],
  'Deep Learning': ['deep learning', 'dl'],
  'NLP': ['nlp', 'natural language processing'],
  'Computer Vision': ['computer vision', 'cv', 'opencv'],
  'Data Analysis': ['data analysis', 'data analytics', 'data analyst'],
  'Power BI': ['power bi', 'powerbi'],
  'Tableau': ['tableau'],
  'Excel': ['excel', 'microsoft excel', 'ms excel'],

  // ── Languages ─────────────────────────────────────────────────────────
  'Java': ['java', 'java se', 'java ee'],
  'C++': ['c++', 'cpp', 'c plus plus'],
  'C#': ['c#', 'csharp', 'c sharp', '.net', 'dotnet', 'asp.net'],
  'Go': ['go', 'golang'],
  'Rust': ['rust', 'rust lang'],
  'PHP': ['php', 'php7', 'php8'],
  'Ruby': ['ruby', 'ruby on rails', 'rails'],
  'Solidity': ['solidity', 'smart contracts', 'ethereum'],
};

module.exports = skillTaxonomy;
