
"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Video, Check, ChevronLeft, ChevronRight, Calendar, Ruler } from "lucide-react";

const CATEGORIES = [
  { id: "cat-home", title: "Kotisiivous", city: "Helsinki", tags: ["Koti", "Ekopesu"], video: "/videos/cat-home-hero.mp4", thumb: "/thumbs/cat-home.jpg", description: "Perussiivous kotiin: lattiat, tasot, keittiö, kylppäri." },
  { id: "cat-office", title: "Toimitilasiivous", city: "Espoo", tags: ["Yritys", "Laskutus"], video: "/videos/cat-office-hero.mp4", thumb: "/thumbs/cat-office.jpg", description: "Työpisteet, neukkarit, keittiö ja saniteettitilat." },
  { id: "cat-construct", title: "Rakennussiivous", city: "Vantaa", tags: ["Raksa", "Pölynpoisto"], video: "/videos/cat-construct-hero.mp4", thumb: "/thumbs/cat-construct.jpg", description: "Rakennus-/remonttikohteen loppusiivous ja jätehuolto." },
  { id: "cat-move", title: "Muuttosiivous", city: "Helsinki", tags: ["Takuu", "Tarkistuslista"], video: "/videos/cat-move-hero.mp4", thumb: "/thumbs/cat-move.jpg", description: "Syväpuhdistus muuttoa varten (uuni, kaapit, kylppäri)." },
];
const TEAMS = [
  { id: "team-solo", title: "Solo-tiimi", size: 1, tags: ["Nopea"], video: "/videos/team-solo-walk.mp4", thumb: "/thumbs/team-solo.jpg", description: "Yksi pro – ketterä ja kustannustehokas." },
  { id: "team-duo", title: "Duo-tiimi", size: 2, tags: ["Tehokas"], video: "/videos/team-duo-walk.mp4", thumb: "/thumbs/team-duo.jpg", description: "Kaksi tekijää – puolita kesto, tasainen laatu." },
  { id: "team-trio", title: "Trio-tiimi", size: 3, tags: ["Suurkohteet"], video: "/videos/team-trio-walk.mp4", thumb: "/thumbs/team-trio.jpg", description: "Kolme tekijää – isoihin ja vauhdikkaisiin toimeksiantoihin." },
];
const STEPS = [
  { key: "service", label: "Palvelu" },
  { key: "team", label: "Tiimi" },
  { key: "details", label: "Tiedot" },
  { key: "pay", label: "Maksu" },
];

export default function Page() {
  const [step, setStep] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [teamIndex, setTeamIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<any>(CATEGORIES[0]);
  const [selectedTeam, setSelectedTeam] = useState<any>(TEAMS[0]);
  const [choices, setChoices] = useState({ bringSupplies: true, date: "2025-09-20", time: "10:00" });
  const [sqm, setSqm] = useState<number>(60);

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  const movePriceBySqm = (m2:number): number | null => {
    const n = Math.max(0, Math.floor(m2));
    if (n <= 40) return 299;
    if (n <= 49) return 359;
    if (n <= 59) return 399;
    if (n <= 69) return 459;
    if (n <= 79) return 499;
    if (n <= 89) return 559;
    if (n <= 99) return 599;
    if (n <= 120) return 699;
    if (n <= 140) return 799;
    return null;
  };
  const basePerM2: Record<string, number> = { "cat-home": 1.3, "cat-office": 1.1, "cat-construct": 1.8, "cat-move": 1.6 };
  const teamMultiplier = (size:number) => (size===1?1 : size===2?1.8 : 2.4);
  const isWeekend = (d:string) => { try { const day = new Date(d).getDay(); return day === 0 || day === 6; } catch { return false; } };
  const calcEstimate = (serviceId:string, m2:number, teamSize:number, bring:boolean, dateStr:string): number | null => {
    if (serviceId === "cat-move") return movePriceBySqm(m2);
    const p = (basePerM2[serviceId] || 1.3) * Math.max(30, m2);
    const supplies = bring ? 8 : 0;
    const wknd = isWeekend(dateStr) ? 1.15 : 1.0;
    const subtotal = (p + supplies) * teamMultiplier(teamSize) * wknd;
    return Math.round(subtotal / 5) * 5;
  };
  const currentEstimate = useMemo(() => {
    const svc = selectedService?.id || "cat-home";
    const tsize = selectedTeam?.size || 1;
    return calcEstimate(svc, sqm, tsize, choices.bringSupplies, choices.date);
  }, [selectedService, selectedTeam, sqm, choices]);

  const moveHoursBySqm = (m2:number): number | null => {
    const n = Math.max(0, Math.floor(m2));
    if (n <= 40) return 6;
    if (n <= 49) return 7;
    if (n <= 59) return 7.5;
    if (n <= 69) return 8;
    if (n <= 79) return 8.5;
    if (n <= 89) return 9;
    if (n <= 99) return 9.5;
    if (n <= 120) return 10;
    if (n <= 140) return 12;
    return null;
  };
  const calcHours = (serviceId:string, m2:number, teamSize:number): number | null => {
    if (serviceId === "cat-move") {
      const single = moveHoursBySqm(m2);
      if (single == null) return null;
      const team = single / Math.max(1, teamSize);
      return Math.round(team * 2) / 2;
    }
    return null;
  };
  const currentHours = useMemo(() => {
    const svc = selectedService?.id || "cat-home";
    const tsize = selectedTeam?.size || 1;
    return calcHours(svc, sqm, tsize);
  }, [selectedService, selectedTeam, sqm]);

  const Carousel = ({ items, index, setIndex, badgeLabel, estimate, hours }: { items: any[]; index: number; setIndex: (n:number)=>void; badgeLabel?: string; estimate?: number | null; hours?: number | null }) => {
    const clampIndex = (n:number) => (n + items.length) % items.length;
    const shift = (dir: number) => setIndex(clampIndex(index + dir));
    return (
      <div className="relative h-[560px] overflow-visible">
        <button className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 border border-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" onClick={()=>shift(-1)} aria-label="Edellinen">‹</button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 border border-white/20 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" onClick={()=>shift(1)} aria-label="Seuraava">›</button>
        <div className="relative h-full">
          {items.map((it, i) => {
            const offset = i - index;
            const wrapped = ((offset + items.length + Math.floor(items.length/2)) % items.length) - Math.floor(items.length/2);
            const scale = wrapped === 0 ? 1 : 0.9; const y = wrapped === 0 ? 0 : 20; const rotate = wrapped * 2; const z = 100 - Math.abs(wrapped);
            return (
              <motion.div key={it.id} className="absolute inset-0 mx-6" style={{ zIndex: z }} initial={false}
                animate={{ scale, y, rotate, opacity: Math.abs(wrapped) > 2 ? 0 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
                onClick={()=>{ setIndex(i); }}>
                <Card className={`h-full rounded-3xl overflow-hidden border ${wrapped===0?"border-white/30":"border-white/15"} bg-white/5 backdrop-blur cursor-pointer`}>
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="relative h-72 w-full bg-black">
                      <video src={it.video} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={it.thumb} />
                      <div className="absolute top-3 left-3"><Badge className="bg-white text-black rounded-full">{badgeLabel || it.city}</Badge></div>
                      {typeof estimate === 'number' ? (
                        <div className="absolute top-3 right-3"><Badge className="bg-white text-black rounded-full font-semibold">Alk. €{estimate}</Badge></div>
                      ) : (
                        <div className="absolute top-3 right-3"><Badge className="bg-white text-black rounded-full font-semibold">Kysy tarjous</Badge></div>
                      )}
                      {typeof hours === 'number' && (<div className="absolute top-12 right-3"><Badge className="bg-white/80 text-black rounded-full">Arvio: {hours} h</Badge></div>)}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-white/80"><span>In‑app video</span></div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h2 className="text-xl font-semibold leading-tight text-white">{it.title}</h2>
                      {it.description && <p className="text-sm text:white/70">{it.description}</p>}
                      {it.tags && (<div className="mt-2 flex gap-2 flex-wrap">{it.tags.map((t: string) => (<Badge key={t} className="bg-white/10 text-white rounded-full border border-white/20">{t}</Badge>))}</div>)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ); })}
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
          {items.map((_, i)=> (<button key={i} onClick={()=>setIndex(i)} className={`w-2 h-2 rounded-full ${i===index?"bg-white":"bg-white/40"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}></button>))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col items-center">
      <header className="w-full max-w-md px-4 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><Shield className="w-6 h-6 text-white" /><h1 className="text-2xl font-bold tracking-tight text-white">Base44 — Siivous</h1></div>
        <Badge className="bg-white/10 text-white">Protector-tyyli</Badge>
      </header>
      <main className="relative w-full max-w-md px-4 mt-2">
        <div className="flex items-center justify_between mb-3">
          <button onClick={()=>setStep(s=>Math.max(0,s-1))} className="p-2 disabled:opacity-30 text-white focus-visible:ring-2 focus-visible:ring-white" disabled={step===0}><ChevronLeft /></button>
          <div className="text-sm uppercase tracking-wide text-white/80">{STEPS[step].label}</div>
          <button onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))} className="p-2 text-white focus-visible:ring-2 focus-visible:ring-white"><ChevronRight /></button>
        </div>

        {step===0 && (<>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
              <Ruler className="w-4 h-4 opacity-80" />
              <input type="number" min="20" max="400" value={sqm} onChange={(e)=> setSqm(Number((e.target as HTMLInputElement).value || 0))} className="bg-transparent outline-none w-full text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white" placeholder="m²"/>
              <span className="text-sm text-white/70">m²</span>
            </label>
            <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
              <Calendar className="w-4 h-4 opacity-80" />
              <input type="date" value={choices.date} onChange={(e)=> setChoices(c=>({...c, date: (e.target as HTMLInputElement).value}))} className="bg-transparent outline-none w-full text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white"/>
            </label>
          </div>
          <Carousel items={CATEGORIES} index={serviceIndex} setIndex={(i)=>{ setServiceIndex(i); setSelectedService(CATEGORIES[i]); }}
            estimate={calcEstimate(CATEGORIES[serviceIndex].id, sqm, selectedTeam?.size||1, choices.bringSupplies, choices.date)}
            hours={calcHours(CATEGORIES[serviceIndex].id, sqm, selectedTeam?.size||1)} />
          <Button className="w-full mt-4 py-5" onClick={()=>setStep(1)}>Valitse palvelu</Button>
        </>)}

        {step===1 && (<>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
              <Ruler className="w-4 h-4 opacity-80" />
              <input type="number" min="20" max="400" value={sqm} onChange={(e)=> setSqm(Number((e.target as HTMLInputElement).value || 0))} className="bg-transparent outline-none w-full text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white" placeholder="m²"/>
              <span className="text-sm text-white/70">m²</span>
            </label>
            <label className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
              <Calendar className="w-4 h-4 opacity-80" />
              <input type="date" value={choices.date} onChange={(e)=> setChoices(c=>({...c, date: (e.target as HTMLInputElement).value}))} className="bg-transparent outline-none w-full text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white"/>
            </label>
          </div>
          <Carousel items={TEAMS} index={teamIndex} setIndex={(i)=>{ setTeamIndex(i); setSelectedTeam(TEAMS[i]); }} badgeLabel="Tiimi"
            estimate={calcEstimate(selectedService?.id||'cat-home', sqm, TEAMS[teamIndex].size, choices.bringSupplies, choices.date)}
            hours={calcHours(selectedService?.id||'cat-home', sqm, TEAMS[teamIndex].size)} />
          <Button className="w-full mt-4 py-5" onClick={()=>setStep(2)}>Valitse tiimi</Button>
        </>)}

        {step===2 && (<Card className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur"><CardContent className="p-0">
          <div className="p-5 space-y-5">
            <div><div className="text-xs uppercase text-white/60 mb-1">Valinta</div>
              <div className="flex flex-wrap gap-2 text-sm"><Badge className="bg-white/10 text-white">{selectedService?.title}</Badge><Badge className="bg-white/10 text-white">{selectedTeam?.title}</Badge></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><div className="text-xs text-white/70">Päivä</div>
                <input type="date" value={choices.date} onChange={(e)=> setChoices((c)=>({ ...c, date: (e.target as HTMLInputElement).value }))}
                  className="w-full bg-black text-white border border-white/20 rounded-xl px-3 py-2 placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white"/></div>
              <div className="space-y-1"><div className="text-xs text-white/70">Aika</div>
                <input type="time" value={choices.time} onChange={(e)=> setChoices((c)=>({ ...c, time: (e.target as HTMLInputElement).value }))}
                  className="w-full bg-black text-white border border-white/20 rounded-xl px-3 py-2 placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white"/></div>
            </div>
            <div className="flex items-center justify-between"><div className="text-sm text-white/80">Tuommeko tarvikkeet</div>
              <Button className="bg-white/10 text-white" variant="secondary" onClick={()=> setChoices((c)=>({...c, bringSupplies: !c.bringSupplies}))}>{choices.bringSupplies ? "Kyllä":"Ei"}</Button></div>
            {(()=>{ const single = calcHours(selectedService?.id||'cat-home', sqm, 1); const team = calcHours(selectedService?.id||'cat-home', sqm, selectedTeam?.size||1);
              if(single==null||team==null) return null; return (<div className="text-sm text-white/80">Aika-arvio: <span className="font-semibold">{team} h</span> (tiimi {selectedTeam?.size||1}) · <span className="opacity-80">{single} h yhdellä</span></div>); })()}
            <Button className="w-full py-5" onClick={()=>setStep(3)}>Jatka maksamiseen <Check className="ml-2 w-4 h-4"/></Button>
          </div>
        </CardContent></Card>)}

        {step===3 && (<Card className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur"><CardContent className="p-0">
          <div className="p-6 space-y-5">
            <div><div className="text-xs uppercase text-white/60 mb-1">Vahvista tilaus</div>
              <div className="text-sm text-white/80">{selectedService?.title} · {selectedTeam?.title} · {choices.date} {choices.time} · {choices.bringSupplies ? "Tarvikkeet tuodaan" : "Asiakkaan tarvikkeet"}</div></div>
            <button onClick={()=> alert("Maksu-API tullaan kytkemään tähän (Stripe/Apple Pay)")} className="w-full py-4 rounded-2xl bg-white text-black hover:bg-white/90 flex items-center justify-center gap-2 text-base font-semibold">Pay with Apple Pay (demo)</button>
            <p className="text-xs text-white/60">Demo: Apple Pay vaatii merchant-validoinnin tai Stripe-integraation.</p>
          </div>
        </CardContent></Card>)}
      </main>
      <footer className="w-full max-w-md px-4 py-8 text-center text-xs text-white/70">UI-proto © Base44 – Protector-tyylinen toteutus.</footer>
    </div>
  );
}
