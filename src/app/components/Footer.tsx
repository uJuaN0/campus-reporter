export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-3">
          <div className="text-sm text-slate-600">
            <p className="font-semibold">Faculdade de Ciências e Tecnologia</p>
            <p>Universidade NOVA de Lisboa</p>
            <p className="mt-1 text-slate-500">Campus de Caparica • 2829-516 Caparica • Portugal</p>
          </div>
          
          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Desenvolvido na <span className="font-semibold text-slate-700">Innovation Week Hackathon</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Grupo <span className="font-semibold">"Di Fora"</span> • Juan Lima, Djeison Santos e Lenine Santos
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
