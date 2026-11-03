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
- karty ofert są bez znacznika klasy aktywów — logo emitenta samo mówi, czyja
  jest oferta, a kropka obok niego tylko hałasowała.

Dane legendy w Figmie (50,0% / 2 109 320 PLN dla obligacji korporacyjnych,
bez obligacji skarbowych) różnią się od naszych — suma 4 218 640,00 PLN jest
ta sama, więc zostały nasze.

Karty ofert mają liczoną szerokość `calc((100% - 3 * 24px) / 4)`, nie sztywne
220 px z Figmy — tam kontener ofert ma 952 px i cztery karty po 220 plus trzy
odstępy wypełniają go co do piksela. U nas treść ma 1064 px, więc sztywne 220
zostawiało 112 px luki przy prawej krawędzi. Piąta oferta sprawi, że pas
zacznie się przewijać, a strzałki przesuwają go dokładnie o jedną kartę.

Logo emitentów leżą w `public/logos` (kopia dla wersji preview w
`preview/logos`) i są podpięte w `src/data/dashboard.ts`. Pliki mają gęstość 3x i są
skalowane w dół do rozmiaru z `width`/`height`, więc zostają ostre także na
ekranach retina. Oferta bez pola `logo` renderuje nazwę emitenta tekstem.

## Przełącznik walutowy na Portfelu

`src/data/currencies.ts`. **To nie jest przeliczanie jednego portfela po
kursie** — każda zakładka to osobny zestaw rachunków prowadzonych w danej
walucie. Przełączenie zmienia sumę, wykres, legendę, gotówkę, karty aktywów
i rachunki naraz.

| | suma | klasy aktywów | rachunki |
|---|---|---|---|
| Łącznie | 4 218 640,00 PLN | 5 + gotówka | 6 |
| PLN | 3 586 420,00 PLN | 5 + gotówka | 4 |
| EUR | 248 400,00 EUR | korpo + FIZ + gotówka | 1 |
| USD | 61 000,00 USD | korpo + gotówka | 1 |

Scenariusz jest policzony tak, żeby wszystko się spinało: udziały w każdym
widoku sumują się do 100,0%, pozycje na rachunkach sumują się do salda
rachunku, a salda rachunków do sumy widoku. W PLN gotówka 193 820 rozkłada
się na wolną/zablokowaną/w drodze i jednocześnie na dwa rachunki — obie
siatki się zgadzają.

Jedna decyzja:

- **W widokach jednowalutowych karty gotówki pokazują rozbicie na rachunki**,
  a nie kolumnę PLN/EUR/USD — ta w widoku EUR czy USD byłaby kolumną
  myślników. W „Łącznie" kolumna walut zostaje, bo tam niesie treść.

Przy okazji: w Figmie wszystkie trzy karty gotówki mają podpis „Wolna
gotówka", co wygląda na pomyłkę przy kopiowaniu. W „Łącznie" zostawione 1:1,
w nowych widokach są poprawne podpisy — do ujednolicenia po Twojej decyzji.

## Makieta (stylistyka nr 3)

Wireframe z Figmy `920:7575` jako trzecia pozycja w przełączniku — żeby na
jednym kliknięciu pokazać klientowi, co jest układem, a co już decyzją
wizualną. Ta sama treść i te same dane co w nr 1 i nr 2; różni się wyłącznie
forma.

- osobny blok tokenów `[data-style='3']`: szarość, płaskie karty, cień
  zastąpiony cienkim obrysem;
- kolory pozycji są ustawiane inline przez `--seg`, więc gasi je jedno
  nadpisanie: `--seg-flat` na `[data-style='3']`, a elementy czytają
  `var(--seg-flat, var(--seg))`;
- karta aktywa ma w makiecie inną budowę: kropka przy nazwie, kwota z „≈",
  wszystkie metryki w szarym pasku i przycisk pod nimi;
- **pigułki pokazują układ, ale nie przełączają** — makieta jest do
  oglądania, nie do klikania;
- makieta nie ma własnej palety: do danych sięga po nr 1, a kolejność pozycji
  bierze z nr 2. Kolor i tak gaśnie w CSS, więc to tylko detal implementacji.

Dane w wireframie z Figmy są inne niż nasze (Emitenci 5, Serie 9, 7,62%).
Zostały nasze — przy porównywaniu trzech wersji jedyną zmienną ma być forma.
