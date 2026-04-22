import { Navigate, useSearchParams } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function OwnerRoute({ children }: Props) {
  const [params] = useSearchParams();
  const token = params.get('token');

  // Si viene el token correcto en la URL, lo guarda en sessionStorage
  if (token === import.meta.env.VITE_OWNER_TOKEN) {
    sessionStorage.setItem('owner_access', 'true');
  }

  const hasAccess = sessionStorage.getItem('owner_access') === 'true';

  return hasAccess ? <>{children}</> : <Navigate to="/no-autorizado" replace />;
}