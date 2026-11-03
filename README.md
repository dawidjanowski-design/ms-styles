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

Nagłówek trzyma układ z wireframe'u: tytuł w lewym rogu, blok „Wartość"
z kwotą w prawym, oba wyrównane do tej samej linii bazowej.

### Waluty i rachunki

Przełącznik walut działa tu tak samo jak na Portfelu i **dzieli z nim stan** —
wejście w obligacje z widoku EUR pokazuje obligacje w EUR, a powrót zachowuje
walutę. Każda waluta to osobny zestaw rachunków, nie przeliczenie.

**Chipy rachunków naprawdę filtrują.** Po zmianie wyboru przeliczają się suma
w nagłówku, cały pasek metryk (liczba emitentów, liczba serii, ważona
rentowność, wypłacone odsetki, najbliższy wykup) i udziały w wierszach. Lista
chipów zależy od waluty — pojawia się tylko rachunek, na którym faktycznie coś
leży, więc nie ma filtrów dających pustą listę.

Serie są przypisane do konkretnych rachunków, nie do emitenta. Po wybraniu IKE
wiersz mówi „1 seria · F · IKE", zamiast chwalić się seriami leżącymi gdzie
indziej.

Liczby wiążą się z resztą prototypu: suma w widoku „Łącznie" to
1 792 922,00 PLN — tyle, ile pokazuje karta obligacji na Portfelu — a część
na IKE w widoku PLN to 340 000,00 PLN, dokładnie tyle, co na ekranie rachunku
IKE. W Figmie nagłówek mówił 1 854 320,00 PLN przy wierszach sumujących się do
1 851 320,00 PLN; żadna z tych liczb nie wiązała się z niczym innym w pliku,
więc odpadły.

Decyzje przy przenoszeniu wireframe'u na stylistykę nr 1:

| Wireframe | Prototyp | Dlaczego |
|---|---|---|
| Karty z obrysem `#ebebeb`, radius 12 | białe karty, radius 16, `--shadow-card` | ten sam materiał co karty na pulpicie portfela |
| Chipy rachunków `#292929` / `#f0f0f0` | `--pill-active-color` / `--pill-track-bg` | kolory przełączają się razem ze stylistyką |
| Nazwa instrumentu 12px | 14px | spójnie z wierszami pozycji na kartach rachunków |

Filtr rachunków jest **wielokrotnego wyboru**, więc świadomie nie wygląda jak
segmentowany przełącznik obok — to osobna kontrolka o innej semantyce.
Zaznaczone chipy są wypełnione lekko, żeby kilka naraz nie krzyczało.
Pusty zbiór znaczy „Wszystkie", dzięki czemu odznaczenie ostatniego rachunku
wraca do pełnej listy samo. W makiecie filtra nie ma wcale.


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

## Licznik kwoty

Zmiana waluty przewija kwotę jak licznik: znak, który się zmienił, wyjeżdża
w górę, a nowy wjeżdża z dołu, z opóźnieniem 18 ms na każdy kolejny znak od
lewej. Znaki bez zmiany stoją w miejscu, więc rusza się tylko to, co
faktycznie jest inne.

Dwie rzeczy, bez których ten efekt by nie działał:

- **cyfry tabelaryczne** (`font-variant-numeric: tabular-nums`) — bez nich
  kwota drgałaby w poziomie przy każdej zmianie cyfry;
- **wychodzący znak jest wyjęty z układu** (`position: absolute`), więc
  animacja nie przesuwa niczego wokół. Po jej zakończeniu znika z DOM-u —
  inaczej kwota kopiowałaby się jako przeplatanka starej i nowej wartości.

Licznik działa wszędzie, gdzie jest kwota, więc przy zmianie waluty przewijają
się też karty gotówki i aktywów. `prefers-reduced-motion` wyłącza animację.

## Panel „Środki w drodze"

Figma `733:825`. Otwiera się po kliknięciu trzeciej karty w sekcji „Gotówka
i środki rozliczeniowe", w stylistykach nr 1 i nr 2. Zamyka go ✕, kliknięcie
w tło albo Esc.

Panel **nie dochodzi do krawędzi** — 8 px marginesu z góry, z prawej i z dołu,
promień 12 px, szerokość 460 px jak na wireframie. Wysuwa się z prawej, tło
przyciemnia się pod nim.

Najmniejszy font w panelu to 13 px. Przy tym rozmiarze nazwa transakcji nie
mieści się w jednej linii obok daty i kwoty, więc zawija się ona, a kwota
zostaje w swojej kolumnie wyrównana do prawej.

Karty gotówki z zerowym saldem są ukryte — w EUR i USD były to dwa puste
prostokąty obok jednej realnej kwoty. Sekcja stoi na siatce trzech kolumn,
więc pojedyncza karta zostaje przy swojej szerokości zamiast rozciągać się
na całość.

Dwie rzeczy przy okazji:

- **Poprawione podpisy kart gotówki.** Wcześniejszy ekran miał trzy razy
  „Wolna gotówka"; ten wireframe nazywa je poprawnie — Wolna gotówka,
  Gotówka zablokowana, Środki w drodze — i tej wersji się trzymamy. Bez tego
  karta „Wolna gotówka" otwierałaby panel „Środki w drodze".
- **Panel otwiera się tylko w widoku „Łącznie".** Pokazuje rozbicie całości
  (45 118,00 PLN, w tym 3 500 EUR), więc w zakładce PLN czy EUR jego liczby
  by nie pasowały do reszty ekranu.

## Ekran emitenta i ekran serii

Figma `722:5483` (emitent) i `722:4654` (seria). Wchodzi się w nie z listy na
ekranie klasy aktywów: w widoku „Emitenci" klik w wiersz otwiera emitenta,
w widoku „Serie" — od razu serię. Z ekranu emitenta klik w serię prowadzi
głębiej. Ścieżka nawigacji na górze cofa na każdy poziom.

Oba istnieją **tylko w stylistykach nr 1 i nr 2** — w makiecie wiersze
instrumentów nigdzie nie prowadzą, bo wireframe'u tych ekranów w wersji
szkicowej nie ma.

Tabela transakcji jest teraz wspólnym komponentem (`Transactions.tsx`) dla
trzech ekranów. Różni je liczba kolumn: na ekranie klasy aktywów rachunek
ma własną kolumnę i jest stopka z paginacją, na węższych ekranach rachunek
schodzi pod nazwę instrumentu, a stopki nie ma — tak jak w wireframe'ach.

## Tabele i rozmiar pisma

Tabele biorą kolory z tokenów stylistyki, nie z twardych szarości: tło
nagłówka zniknęło (wystarcza waga pisma i jedna linia), obrysy i podziały
idą z `--divider`, promień z `--card-radius`, a plakietki statusu z
`--pill-track-bg` / `--pill-active-color`. Dzięki temu w nr 1 są ciepłe,
w nr 2 chłodne, a w makiecie szare — bez osobnych reguł.

**Najmniejszy font w stylistykach nr 1 i nr 2 to 13 px.** Dotyczy to całego
interfejsu, nie tylko tabel: podpisy filtrów, plakietki, metryki, podlinie
w wierszach, przyciski i pigułki. Sprawdzane automatycznie — przejście po
wszystkich elementach tekstowych na obu ekranach nie znajduje nic poniżej.

Dwa wyjątki, świadome:

- **Makieta** zostaje przy swoim drobnym piśmie (9–12 px). To wireframe i
  właśnie takie proporcje odróżniają go od gotowego UI.
- **Przełącznik stylistyk** na dole ekranu to nasze narzędzie do przeglądania,
  a nie element produktu.

Przy okazji pigułki w nr 1 urosły z 12 na 13 px — w Figmie było 12, ale
minimum wygrywa.

## Ekran rachunku (IKE)

Figma `722:3828`. Wchodzi się z widoku „Rachunki" na ekranie Portfel —
przyciskiem „Zobacz szczegóły" na karcie IKE.

Trzy świadome odstępstwa od wireframe'u:

- **Przyciski Aktywa / Transakcje na górze pominięte** — zgodnie z ustaleniem.
- **Osobna karta „Wolne środki 46 237,00 PLN" pominięta.** Wireframe ma ją
  zaraz pod paskiem limitu, ale ta sama kwota stoi 3 cm wyżej w pierwszej
  karcie, jako pierwsza z trzech. Wygląda na pozostałość po wcześniejszej
  wersji układu; łatwo przywrócić, jeśli miała inną rolę.
- **Ekran działa tylko dla IKE i tylko w widoku „Łącznie".** Liczby na nim —
  506 237,00 PLN, w tym 340 000 obligacji, 120 000 FIO i 46 237 wolnych
  środków — zgadzają się z kartą IKE w widoku łącznym. W zakładce PLN ten
  sam rachunek ma inną wartość, więc tam wejście jest wyłączone.

W makiecie ekranu nie ma.

## Pasek limitu wpłat

Wypełnienie jest zielone (`--progress-fill`, ta sama zieleń co pozycja
gotówki w legendzie — paleta zostaje zamknięta), a pod nim widać szary tor
(`--progress-track`), więc wiadomo, gdzie postęp się kończy.

Wcześniej tor miał `background: var(--l2)` — token, którego nigdy nie było
w pliku. Tło rozwiązywało się do przezroczystego i pasek wyglądał, jakby
kończył się na końcu wypełnienia. Ten sam nieistniejący token był obrysem
przycisku na karcie rachunku, przez co przycisk brał kolor tekstu zamiast
delikatnej linii.

Wypełnienie celowo nie jest w kolorze rachunku: czerwień IKE czytałaby się
jak ostrzeżenie, a wykorzystany limit wpłat nie jest problemem. W makiecie
pasek zostaje szary.

## Spójność: fonty i kolory

Dwie rzeczy są pilnowane automatycznie, skryptem przechodzącym po wszystkich
ekranach (pulpit, portfel, rachunki, rachunek IKE, obligacje, emitent, seria,
panel środków w drodze) w stylistykach nr 1 i nr 2:

1. **Żaden tekst nie schodzi poniżej 13 px.**
2. **Żaden ciepły odcień z nr 1 nie pojawia się w nr 2.**

Żeby to utrzymać, kolory wpisane wcześniej na sztywno w `app.css` trafiły do
tokenów nadpisywanych per stylistyka:

| token | nr 1 | nr 2 | co trzyma |
|---|---|---|---|
| `--value-strong` | `#342717` | `#171934` | kwoty w legendzie, wierszach i zdarzeniach |
| `--nav-active-bg` / `--nav-active-color` | `#f7f5f3` / `#342717` | `#f0f0f2` / `#171934` | aktywna pozycja nawigacji |
| `--avatar-bg` | `#ddd8d2` | `#d9d9d9` | awatar w nagłówku |
| `--crumb-sep` | `#c4bfba` | `#c9c9c9` | separator ścieżki nawigacji |
| `--sub-faint` | `#b4aea8` | `#aeaeae` | podlinie w listach parametrów |
| `--chip-border-hover` | `#e0ddd9` | `#dcdcdc` | obrys chipa pod kursorem |
| `--chev`, `--rule`, `--btn-bg` | wspólne | wspólne | strzałki, linie, tła przycisków |

Wcześniej kwoty w nr 2 były brązowe, bo brały `#342717` prosto z nr 1.

W całym `app.css` poza blokiem makiety i przełącznikiem stylistyk nie ma już
ani jednego koloru wpisanego na sztywno.

**Makieta zostaje szara.** Sprawdzane osobno: na jej ekranach nie ma ani
jednego nasyconego koloru.
