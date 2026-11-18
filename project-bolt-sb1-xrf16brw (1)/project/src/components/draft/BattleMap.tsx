import { useState } from 'react';
import { Coins, MapPin, Pencil, Shield, ShieldOff } from 'lucide-react';
import { useGameData } from '@/context/useGameData';
import { useT } from '@/i18n/useT';
import { cn } from '@/lib/cn';
import {
  MAP_IMAGE_PATH,
  MAP_ASPECT_RATIO,
  TOWERS,
  HERO_POSITIONS,
  FARM_MARKERS,
  heroPosTeam,
  farmTeam,
  type HeroPosDef,
  type TowerDef,
} from './mapData';
import { HeroPickerModal } from './HeroPickerModal';
import type { DraftMatch, FarmAssignments, TowerStatus } from '@/types/draft';

interface BattleMapProps {
  match: DraftMatch;
  onChange: (next: DraftMatch) => void;
}

export function BattleMap({ match, onChange }: BattleMapProps) {
  const t = useT();
  const { index } = useGameData();
  const [imgError, setImgError] = useState(false);
  const [pickerPos, setPickerPos] = useState<string | null>(null);
  // Position currently selected for swap/move; null when no swap is in progress.
  const [swapPos, setSwapPos] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const mapState = match.mapState;
  const heroPositions = mapState?.heroPositions ?? {};
  const towerStates = mapState?.towerStates ?? [];
  const farmAssignments: FarmAssignments = mapState?.farmAssignments ?? {};

  const towerStatusMap = new Map(towerStates.map((ts) => [ts.id, ts.status]));
  const getTowerStatus = (towerId: string): TowerStatus => towerStatusMap.get(towerId) ?? 'alive';

  const heroName = (heroId: string | null): string | null => {
    if (!heroId) return null;
    const hero = index.heroById.get(heroId);
    return hero ? hero.name : null;
  };

  const updateMapState = (partial: Partial<NonNullable<DraftMatch['mapState']>>) => {
    const current = match.mapState ?? { heroPositions: {}, towerStates: [] };
    onChange({ ...match, mapState: { ...current, ...partial } });
  };

  const toggleTower = (towerId: string) => {
    const current = match.mapState?.towerStates ?? [];
    const existingIdx = current.findIndex((ts) => ts.id === towerId);
    const newStates = [...current];
    if (existingIdx >= 0) {
      newStates[existingIdx] = {
        ...newStates[existingIdx],
        status: newStates[existingIdx].status === 'alive' ? 'destroyed' : 'alive',
      };
    } else {
      newStates.push({ id: towerId, status: 'destroyed' });
    }
    updateMapState({ towerStates: newStates });
  };

  const setPosHero = (posId: string, heroId: string | null) => {
    if (heroId !== null) {
      const occupiedElsewhere = Object.entries(heroPositions).some(([id, currentHeroId]) => id !== posId && currentHeroId === heroId);
      if (occupiedElsewhere) return;
    }
    const nextPositions = { ...heroPositions, [posId]: heroId };
    // Drop farm assignments for heroes no longer placed on the map.
    const placed = new Set(Object.values(nextPositions).filter((id): id is string => id !== null));
    const nextFarm: FarmAssignments = {};
    for (const [farmId, farmHeroId] of Object.entries(farmAssignments)) {
      if (farmHeroId && placed.has(farmHeroId)) nextFarm[farmId] = farmHeroId;
    }
    updateMapState({ heroPositions: nextPositions, farmAssignments: nextFarm });
  };

  const swapOrMove = (fromPos: string, toPos: string) => {
    const fromHero = heroPositions[fromPos] ?? null;
    const toHero = heroPositions[toPos] ?? null;
    updateMapState({
      heroPositions: { ...heroPositions, [fromPos]: toHero, [toPos]: fromHero },
    });
    setSwapPos(null);
  };

  const handlePosClick = (posId: string) => {
    if (swapPos === posId) {
      setSwapPos(null);
      setFeedback(null);
      return;
    }
    if (swapPos) {
      if (heroPosTeam(swapPos) !== heroPosTeam(posId)) {
        setFeedback(t('map.swap.crossTeam'));
        return;
      }
      swapOrMove(swapPos, posId);
      setFeedback(null);
      return;
    }
    if (feedback) setFeedback(null);
    if (heroPositions[posId]) {
      setSwapPos(posId);
    } else {
      setPickerPos(posId);
    }
  };

  const editPosition = (posId: string) => {
    setSwapPos(null);
    setFeedback(null);
    setPickerPos(posId);
  };

  const startSwapFromPicker = (posId: string) => {
    setPickerPos(null);
    setFeedback(null);
    setSwapPos(posId);
  };

  const toggleSoloFarm = (posId: string) => {
    const heroId = heroPositions[posId] ?? null;
    if (!heroId) return;
    const team = heroPosTeam(posId);
    const teamFarmIds = FARM_MARKERS.filter((f) => farmTeam(f.id) === team).map((f) => f.id);
    const alreadyFarm = teamFarmIds.some((f) => farmAssignments[f] === heroId);
    const nextFarm: FarmAssignments = { ...farmAssignments };
    if (alreadyFarm) {
      for (const f of teamFarmIds) delete nextFarm[f];
    } else {
      for (const f of teamFarmIds) nextFarm[f] = heroId;
    }
    updateMapState({ farmAssignments: nextFarm });
  };

  const teamPickedHeroes = (team: 'ally' | 'enemy'): string[] => {
    const slots = team === 'ally' ? match.allyHeroes : match.enemyHeroes;
    return slots.filter((id): id is string => id !== null);
  };

  // A hero is taken if it occupies any of the 10 positions (no duplicates allowed).
  const takenHeroIds = new Set(Object.values(heroPositions).filter((id): id is string => id !== null));

  const posSoloFarm = (posId: string): boolean => {
    const heroId = heroPositions[posId];
    if (!heroId) return false;
    return FARM_MARKERS.some((f) => farmTeam(f.id) === heroPosTeam(posId) && farmAssignments[f.id] === heroId);
  };

  const pickerTeam = pickerPos ? heroPosTeam(pickerPos) : null;
  const pickerCurrent = pickerPos ? heroPositions[pickerPos] ?? null : null;
  const pickerTaken = new Set(
    Object.entries(heroPositions)
      .filter(([posId, heroId]) => heroId !== null && posId !== pickerPos)
      .map(([, heroId]) => heroId as string),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px]">
      <div className="rounded-2xl border border-gold/30 bg-panel p-3 shadow-[0_0_32px_rgb(var(--c-gold)/0.08)]">
        {swapPos && (
          <p className="mb-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs text-gold">
            {t('map.swap.selectTarget')}
          </p>
        )}
        {feedback && (
          <p role="alert" className="mb-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-1.5 text-xs text-danger">
            {feedback}
          </p>
        )}
        <div
          className="relative w-full overflow-hidden rounded-lg border border-line bg-black/40 select-none"
          style={{ aspectRatio: MAP_ASPECT_RATIO }}
        >
          {!imgError ? (
            <img
              src={MAP_IMAGE_PATH}
              alt="DotA Allstars battle map"
              className={cn(
                'absolute inset-0 h-full w-full object-contain transition-opacity duration-300',
                'opacity-100',
              )}
              onError={() => setImgError(true)}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <MapPin className="h-8 w-8 text-danger" />
              <p className="text-sm text-danger">{t('map.imageError')}</p>
            </div>
          )}

          {/* Towers */}
          {TOWERS.map((tower) => (
            <TowerMarker
              key={tower.id}
              tower={tower}
              status={getTowerStatus(tower.id)}
              onClick={() => toggleTower(tower.id)}
            />
          ))}

          {/* Farm markers */}
          {FARM_MARKERS.map((farm) => (
            <FarmMarker key={farm.id} farm={farm} heroName={heroName(farmAssignments[farm.id] ?? null)} />
          ))}

          {/* Hero positions */}
          {HERO_POSITIONS.map((pos) => (
            <HeroPosMarker
              key={pos.id}
              pos={pos}
              team={heroPosTeam(pos.id)}
              heroId={heroPositions[pos.id] ?? null}
              heroName={heroName(heroPositions[pos.id] ?? null)}
              swapSelected={swapPos === pos.id}
              swapActive={swapPos !== null}
              soloFarm={posSoloFarm(pos.id)}
              onClick={() => handlePosClick(pos.id)}
              onEdit={() => editPosition(pos.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-line bg-card p-4">
        <h3 className="font-display text-sm font-semibold text-ink">{t('map.legend')}</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted">
            <span className="h-3 w-3 rounded-full border-2 border-success bg-success/20" />
            <span>{t('map.legend.heroPos')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Coins className="h-3 w-3 text-gold" />
            <span>{t('map.legend.farm')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Shield className="h-3 w-3 text-success" />
            <span>{t('map.towerAlive')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <ShieldOff className="h-3 w-3 text-danger/60" />
            <span>{t('map.towerDestroyed')}</span>
          </div>
        </div>
        <p className="text-[10px] text-muted">{t('map.towerClickHint')}</p>
        <p className="text-[10px] text-muted">{t('map.swap.hint')}</p>
      </div>

      {pickerPos && pickerTeam && (
        <HeroPickerModal
          currentHeroId={pickerCurrent}
          takenIds={pickerTaken}
          onSelect={(heroId) => {
            setPosHero(pickerPos, heroId);
            setPickerPos(null);
          }}
          onRemove={pickerCurrent ? () => {
            setPosHero(pickerPos, null);
            setPickerPos(null);
          } : undefined}
          onClose={() => setPickerPos(null)}
          teamHeroes={teamPickedHeroes(pickerTeam)}
          teamLabel={pickerTeam === 'ally' ? t('map.team.ally') : t('map.team.enemy')}
          soloFarm={
            pickerCurrent
              ? { active: posSoloFarm(pickerPos), onToggle: () => toggleSoloFarm(pickerPos) }
              : undefined
          }
          onStartSwap={pickerCurrent ? () => startSwapFromPicker(pickerPos) : undefined}
        />
      )}
    </div>
  );
}

function TowerMarker({ tower, status, onClick }: { tower: TowerDef; status: TowerStatus; onClick: () => void }) {
  const t = useT();
  const destroyed = status === 'destroyed';
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border transition-all cursor-pointer hover:scale-110',
        destroyed
          ? 'border-danger/40 bg-danger/10 text-danger/60 grayscale'
          : 'border-gold/60 bg-gold/15 text-gold shadow-[0_0_8px_rgb(var(--c-gold)/0.3)]',
      )}
      style={{ left: `${tower.x * 100}%`, top: `${tower.y * 100}%`, width: 20, height: 20 }}
      aria-label={`${t('map.tower')} ${tower.id}`}
      title={`${tower.id} · ${destroyed ? t('map.towerDestroyed') : t('map.towerAlive')}`}
    >
      {destroyed ? <ShieldOff className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
    </button>
  );
}

function FarmMarker({ farm, heroName }: { farm: HeroPosDef; heroName: string | null }) {
  const t = useT();
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${farm.x * 100}%`, top: `${farm.y * 100}%` }}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 backdrop-blur-sm',
          'border-gold bg-gold/20 text-gold shadow-[0_0_8px_rgb(var(--c-gold)/0.3)]',
        )}
        style={{ width: 26, height: 26 }}
        role="img"
        aria-label={heroName ? `${t('map.legend.farm')} ${farm.id}: ${heroName}` : `${t('map.legend.farm')} ${farm.id}`}
        title={heroName ? `${farm.id} · ${heroName}` : `${farm.id} · ${t('map.legend.farm')}`}
      >
        {heroName ? (
          <span className="font-display text-[10px] font-bold">{heroName.charAt(0).toUpperCase()}</span>
        ) : (
          <Coins className="h-3 w-3" />
        )}
      </div>
      {heroName && (
        <span className="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap rounded bg-black/60 px-1 text-[8px] font-medium text-gold">
          {heroName}
        </span>
      )}
    </div>
  );
}

function HeroPosMarker({
  pos,
  team,
  heroId,
  heroName,
  swapSelected,
  swapActive,
  soloFarm,
  onClick,
  onEdit,
}: {
  pos: HeroPosDef;
  team: 'ally' | 'enemy';
  heroId: string | null;
  heroName: string | null;
  swapSelected: boolean;
  swapActive: boolean;
  soloFarm: boolean;
  onClick: () => void;
  onEdit: () => void;
}) {
  const t = useT();

  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex items-center justify-center rounded-full border-2 backdrop-blur-sm transition-all cursor-pointer hover:scale-110',
          swapSelected
            ? 'animate-pulse border-gold bg-gold/25 shadow-[0_0_14px_rgb(var(--c-gold)/0.6)]'
            : heroId
              ? 'border-solid border-success bg-card/95 shadow-[0_0_10px_rgb(var(--c-success)/0.4)]'
              : swapActive
                ? 'border-dashed border-gold/60 bg-gold/10 hover:border-gold hover:bg-gold/20'
                : 'border-dashed border-success/60 bg-success/15 text-success hover:border-success hover:bg-success/25',
        )}
        style={{ width: 30, height: 30 }}
        aria-label={heroName ? `${pos.id}: ${heroName}` : `${t('map.legend.heroPos')} ${pos.id}`}
        aria-pressed={swapSelected}
        title={
          heroName
            ? `${pos.id} · ${heroName}${soloFarm ? ` · ${t('map.soloFarm')}` : ''}`
            : `${pos.id} · ${t('map.heroEmpty')}`
        }
      >
        {heroId ? (
          <span className="font-display text-[10px] font-bold text-ink">{heroName?.charAt(0).toUpperCase()}</span>
        ) : (
          <span className={cn('text-[8px] font-bold', swapActive && 'text-gold')}>{pos.id}</span>
        )}
      </button>
      {heroName && (
        <span
          className={cn(
            'absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap rounded bg-black/60 px-1 text-[8px] font-medium',
            soloFarm ? 'text-gold' : 'text-success',
          )}
        >
          {soloFarm ? `${heroName} · ${t('map.soloFarm')}` : heroName}
        </span>
      )}
      {heroId && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border border-line bg-card text-muted transition-colors hover:text-ink"
          aria-label={`${t('map.editHero')} ${pos.id}`}
          title={t('map.editHero')}
        >
          <Pencil className="h-2.5 w-2.5" />
        </button>
      )}
      <span className="sr-only">{team}</span>
    </div>
  );
}
