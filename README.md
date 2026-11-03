# Michael / Ström — Strefa Klienta · prototyp stylistyk

Klikalny prototyp ekranu **Portfela** w dwóch wersjach stylistycznych, z przełącznikiem
pozwalającym porównać je na żywo.

Źródło: plik Figma `-INT- Michael Storm - Product Design`, strona `↳ ・Portfel UI`
- **Stylistyka nr 1** — node `902:925`
- **Stylistyka nr 2** — node `899:3329`

## Uruchomienie

```bash
npm install
npm run dev
```

Przełącznik stylistyk jest przyklejony na dole ekranu. Wybór zapisuje się w `localStorage`,
więc po odświeżeniu zostaje ta sama wersja.

### Wersja bez instalacji

`preview/index.html` to ta sama makieta bez żadnych zależności — wystarczy podać ją przez
dowolny serwer statyczny (np. `npx serve .`) i wejść na `/preview/`. Przydatne, gdy klient
ma tylko przeglądarkę. Korzysta z tych samych plików tokenów i stylów co build React,
więc nie rozjedzie się z wersją właściwą.

## Co jest odwzorowane 1:1

Wszystkie wartości pochodzą z inspekcji węzłów Figmy, nie z oka:

- **Siatka** — ekran 1440, kontener treści 1064, padding ekranu `40 / 28 / 120`, promień 16,
  tło `#f8f7f7`, obrys `#f0f0f0`
- **Typografia** — Inter; nagłówek 18 (Medium w nr 1, Regular w nr 2), kwota główna 30 px
  z częścią dziesiętną 21,6 px w kolorze `#98918b`, etykiety 13 px, metryki 12/14 px
- **Pigułki** — tor `#f1eeea` (nr 1) / `#ececec` (nr 2), wysokość 33 / 38 px, padding
  13,714 / 16 px, aktywna biała z `rgba(255,255,255,.7)` i cieniem z Figmy
- **Wykres** — słupki 56 px, przerwa 4 px, promień 2 px, wypełnienie **10 %** koloru
  (dokładnie jak w Figmie), pod spodem pasek 4 px w pełnym kolorze; segment gotówki ma
  szrafowanie na tle `#f2f5e3` z paskiem `#9ec421`
- **Karty** — białe, promień 16, cienie przeniesione 1:1; w nr 1 karta ma padding
  `20 2 2 2` i szary pasek metryk, w nr 2 padding `20` i wszystkie metryki jako wiersze
- **Ikony** — logo i dzwonek jako SVG wyeksportowane z Figmy, bez przerysowywania

## Interakcje

- **Hover na wykresie, legendzie lub karcie** wiąże te trzy miejsca ze sobą: element,
  nad którym jest kursor, **nie zmienia się w żaden sposób**, a wszystko pozostałe gaśnie
  do 32 %. Żadnych przesunięć, powiększeń ani zmian cienia — układ stoi w miejscu.
- Przełączniki walut (`Łącznie / PLN / EUR / USD`) oraz `Aktywa / Rachunki` są klikalne
  i trzymają stan.
- Wszystkie elementy interaktywne są dostępne z klawiatury — segmenty wykresu mają
  `:focus-visible` z obrysem w kolorze segmentu.

## Jedno odstępstwo i jedna rzecz do decyzji

**Szerokości segmentów wykresu** liczą się z danych, a nie z makiety. W Figmie są
narysowane ręcznie i nie zgadzają się z procentami obok (56 px przy 7,5 %, a 142 px
przy 7,7 %). W prototypie wykres zgadza się z liczbami w legendzie.

**Kolory w stylistyce nr 1 są przeniesione dosłownie** — a to znaczy, że to samo aktywo
ma trzy różne kolory, zależnie od miejsca:

| Aktywo | Wykres | Legenda | Kropka na karcie |
|---|---|---|---|
| Obligacje korporacyjne | `#065eec` | `#065eec` | `#042468` |
| Obligacje skarbowe | `#e4b212` | `#e4b212` | `#0a21c8` |
| Asset Management | `#11aebd` | `#0a21c8` | `#0aa6c8` |
| Fundusze otwarte (FIO) | `#7e2cb1` | `#0aa6c8` | `#ef4444` |
| Fundusze zamknięte (FIZ) | `#ef7744` | `#ef4444` | `#e4b212` |

Kropki na kartach to paleta legendy **przesunięta o jedną pozycję** — wygląda na
pomyłkę przy kopiowaniu, nie na decyzję. Stylistyka nr 2 takiego rozjazdu nie ma,
tam wszystkie trzy miejsca używają jednego koloru. Do rozstrzygnięcia.

## Struktura

```
src/
  data/portfolio.ts     dane i kolejność pozycji — jedno źródło dla obu stylistyk
  styles/tokens.css     tokeny obu stylistyk, przełączane przez [data-style]
  styles/app.css        layout i komponenty
  components/ui.tsx     nagłówek, pigułki, kwota, wiersz etykieta/wartość
  components/Portfolio.tsx  wykres, legenda, gotówka, karty aktywów
  icons/Logo.tsx        logo i dzwonek z Figmy
preview/                wersja bez zależności (ten sam CSS)
```

Dodanie kolejnych ekranów z wireframe'ów sprowadza się do nowego komponentu
korzystającego z tych samych tokenów — żadnych wartości na sztywno w markupie.

## Publikacja (GitHub Pages)

W repo jest workflow `.github/workflows/deploy.yml`, który przy każdym pushu na `main`
buduje projekt i publikuje go na GitHub Pages.

Jednorazowo trzeba włączyć Pages w repozytorium:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Po pierwszym przebiegu strona będzie pod
`https://dawidjanowski-design.github.io/ms-styles/`,
a wersja bez zależności pod `.../ms-styles/preview/`.

## Ekran klasy aktywów — obligacje korporacyjne

Wireframe `909:978` przeniesiony na stylistykę nr 1. Wejście: klik w kartę
„Obligacje korporacyjne" w Strukturze aktywów albo w ten sam wiersz legendy
pod wykresem. Powrót — przez „Portfel" lub „Aktywa" w ścieżce nawigacji.

Co działa naprawdę: przełącznik Emitenci/Serie, zakładki transakcji
(Wszystkie / Operacje / Przepływy / Zamknięte pozycje), filtr okresu, filtr
typu transakcji i wyszukiwarka instrumentu. Licznik „X z 68" przelicza się
wraz z filtrami.

Decyzje przy przenoszeniu wireframe'u na stylistykę nr 1:

| Wireframe | Prototyp | Dlaczego |
|---|---|---|
| Karty z obrysem `#ebebeb`, radius 12 | białe karty, radius 16, `--shadow-card` | ten sam materiał co karty na pulpicie portfela |
| H1 28px + blok „Wartość" po prawej | tytuł 18px + kwota 30px pod nim | układ nagłówka taki sam jak na ekranie Portfel |
| Chipy rachunków `#292929` / `#f0f0f0` | `--pill-active-color` / `--pill-track-bg` | kolory przełączają się razem ze stylistyką |
| Nazwa instrumentu 12px | 14px | spójnie z wierszami pozycji na kartach rachunków |

Dwie rzeczy do decyzji po stronie klienta:

- **Suma się nie zgadza.** Nagłówek w Figmie mówi 1 854 320,00 PLN, a trzy
  wiersze emitentów dają 1 851 320,00 PLN. Zostawione 1:1.
- **Chipy rachunków nie filtrują.** Wireframe nie definiuje, jak pozycje
  rozkładają się na rachunki, a dopisywanie takiego podziału z głowy trafiłoby
  do klienta jako ustalenie. Na razie chipy tylko przełączają stan.

Widok w stylistyce nr 2 dziedziczy tokeny i renderuje się poprawnie, ale nie
był jeszcze dopracowywany.

## Pulpit

Wireframe `920:7375` wdrożony w obu stylistykach. Jest ekranem startowym;
nawigacja Pulpit ↔ Portfel działa z górnego menu, a przycisk „Przejdź do
portfela" prowadzi na ten sam ekran.

Z pliku wzięta jest treść i układ. Reszta pochodzi z prototypu:

- **wykres i legenda to nasz komponent** z ekranu Portfel — ten sam podział,
  te same kolory per stylistyka, to samo przygaszanie na hover; dzięki temu
  Pulpit i Portfel nie pokazują dwóch różnych portfeli;
- gradientowe tło strony i tonowane wypełnienia słupków pominięte — kolor
  niesie wyłącznie paleta klas aktywów;
- karty ofert mają znacznik klasy aktywów w tej samej konwencji co karty
  aktywów: kropka w nr 1, pionowa kreska w nr 2.

Dane legendy w Figmie (50,0% / 2 109 320 PLN dla obligacji korporacyjnych,
bez obligacji skarbowych) różnią się od naszych — suma 4 218 640,00 PLN jest
ta sama, więc zostały nasze.

Logo emitentów leżą w `public/logos` (kopia dla wersji preview w
`preview/logos`) i są podpięte w `src/data/dashboard.ts`. Pliki mają gęstość 3x i są
skalowane w dół do rozmiaru z `width`/`height`, więc zostają ostre także na
ekranach retina. Oferta bez pola `logo` renderuje nazwę emitenta tekstem.
