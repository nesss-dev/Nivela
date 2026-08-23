import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Nivela</h1>
          <p className="mt-2 text-lg text-gray-600">
            Presupuesto para ingresos irregulares
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href="/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Crear cuenta
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Calcula tu sueldo seguro a partir de tu historial real de ingresos
        </p>
      </div>
    </div>
  );
}