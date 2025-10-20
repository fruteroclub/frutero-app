-- Seed Mentors Script
-- Creates sample mentor users with metadata

-- Insert mentor users with metadata
INSERT INTO users (id, username, display_name, email, avatar_url, metadata)
VALUES
  (
    'mentor-1-maria-frontend',
    'maria_frontend',
    'María González',
    'maria@fruteroclub.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    '{
      "isMentor": true,
      "mentorAvailability": "available",
      "expertiseAreas": ["frontend", "design", "ui"],
      "mentoringApproach": "Enfoque práctico centrado en proyectos reales. Me especializo en ayudar a builders a crear interfaces hermosas y funcionales usando React, Next.js y Tailwind.",
      "maxParticipants": 5,
      "experience": "10+ años desarrollando productos web. Ex-Tech Lead en startups de SV. Actualmente construyendo herramientas para creadores."
    }'::jsonb
  ),
  (
    'mentor-2-carlos-blockchain',
    'carlos_web3',
    'Carlos Ramírez',
    'carlos@fruteroclub.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    '{
      "isMentor": true,
      "mentorAvailability": "limited",
      "expertiseAreas": ["blockchain", "defi", "backend"],
      "mentoringApproach": "Mentoría enfocada en fundamentos de blockchain y desarrollo de contratos inteligentes. Trabajo 1-on-1 con builders que quieren dominar Solidity y EVM.",
      "maxParticipants": 3,
      "experience": "Smart contract engineer desde 2017. Auditor de seguridad. He participado en 20+ proyectos DeFi."
    }'::jsonb
  ),
  (
    'mentor-3-lucia-ai',
    'lucia_ai',
    'Lucía Morales',
    'lucia@fruteroclub.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia',
    '{
      "isMentor": true,
      "mentorAvailability": "available",
      "expertiseAreas": ["ai", "backend", "product"],
      "mentoringApproach": "Te ayudo a integrar IA en tus productos de forma práctica. Desde prompt engineering hasta fine-tuning de modelos. Enfoque en crear valor real para usuarios.",
      "maxParticipants": 4,
      "experience": "ML Engineer en big tech. Ahora fundadora de startup de AI tools. He lanzado 5 productos con IA que generan revenue."
    }'::jsonb
  ),
  (
    'mentor-4-diego-devops',
    'diego_devops',
    'Diego Hernández',
    'diego@fruteroclub.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
    '{
      "isMentor": true,
      "mentorAvailability": "available",
      "expertiseAreas": ["devops", "backend", "infrastructure"],
      "mentoringApproach": "Mentoría en infraestructura, deployment y scaling. Te enseño a shipear rápido sin sacrificar confiabilidad. CI/CD, Docker, Kubernetes, cloud.",
      "maxParticipants": 5,
      "experience": "15 años en DevOps. Ex-SRE en unicornio. Ahora consultor ayudando startups a escalar desde 0 a millones de usuarios."
    }'::jsonb
  ),
  (
    'mentor-5-ana-growth',
    'ana_growth',
    'Ana Torres',
    'ana@fruteroclub.com',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    '{
      "isMentor": true,
      "mentorAvailability": "available",
      "expertiseAreas": ["growth", "product", "mobile"],
      "mentoringApproach": "Te ayudo a conseguir tus primeros 1000 usuarios y monetizar. Growth hacking, product-market fit, analytics, conversion optimization.",
      "maxParticipants": 6,
      "experience": "Growth PM en startups YC. Llevé 3 productos de 0 a 100K usuarios. Experta en growth loops y viral mechanics."
    }'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  metadata = EXCLUDED.metadata,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url;

-- Insert profiles for mentors
INSERT INTO profiles (user_id, professional_profile, country, city_region)
VALUES
  (
    'mentor-1-maria-frontend',
    'Frontend developer apasionada por crear experiencias de usuario excepcionales. Me encanta enseñar y ver crecer a otros developers.',
    'México',
    'Ciudad de México'
  ),
  (
    'mentor-2-carlos-blockchain',
    'Blockchain engineer especializado en DeFi y seguridad. Mi misión es hacer web3 más accesible para builders latinoamericanos.',
    'Colombia',
    'Bogotá'
  ),
  (
    'mentor-3-lucia-ai',
    'ML engineer y founder. Ayudo a builders a integrar IA en sus productos de forma práctica y rentable.',
    'Argentina',
    'Buenos Aires'
  ),
  (
    'mentor-4-diego-devops',
    'DevOps engineer con experiencia en empresas de alto crecimiento. Evangelista de shipping rápido con calidad.',
    'Chile',
    'Santiago'
  ),
  (
    'mentor-5-ana-growth',
    'Product growth specialist. Me apasiona ayudar a founders a encontrar PMF y escalar sus productos.',
    'México',
    'Guadalajara'
  )
ON CONFLICT (user_id) DO UPDATE SET
  professional_profile = EXCLUDED.professional_profile,
  country = EXCLUDED.country,
  city_region = EXCLUDED.city_region;

-- Output success message
SELECT 'Mentors seeded successfully! 5 mentors created with profiles.' as result;
