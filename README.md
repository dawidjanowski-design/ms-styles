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

- **Hover na wykresie, legendzie lub karcie** podświetla dane aktywo w **trzech miejscach
  naraz** — segment wykresu przechodzi na pełny kolor i unosi się o 2 px, wiersz legendy
  i karta zostają w pełnej jasności, a cała reszta gaśnie do 32 %.
- Przełączniki walut (`Łącznie / PLN / EUR / USD`) oraz `Aktywa / Rachunki` są klikalne
  i trzymają stan.
- Wszystkie elementy interaktywne są dostępne z klawiatury — segmenty wykresu mają
  `:focus-visible` z obrysem w kolorze segmentu.

## Trzy miejsca, gdzie makieta Figmy była niespójna

Żeby prototyp dało się kliknąć, trzeba było te niespójności rozstrzygnąć. Wszystkie
dotyczą **tylko stylistyki nr 1** — nr 2 jest spójna.

1. **Kolory aktywów** — w nr 1 to samo aktywo ma trzy różne kolory: inny na wykresie
   (`#11aebd`, `#7e2cb1`, `#ef7744`), inny w legendzie (`#0aa6c8`, `#0a21c8`, `#ef4444`)
   i jeszcze inny na kropce karty (`#042468`). Przy podświetlaniu powiązanych elementów
   trzy palety wyglądałyby na błąd, więc przyjęta jest **paleta z legendy** — ta jedyna
   ma komplet sześciu pozycji i zgadza się z kolejnością.
2. **Szerokości segmentów wykresu** — w obu makietach narysowane są ręcznie i nie
   odpowiadają procentom z legendy (np. 185 px przy 14,0 %). W prototypie szerokości
   liczą się z danych, więc wykres zgadza się z liczbami obok.
3. **Kolejność segmentów** — na wykresie inna niż w legendzie. Prototyp używa jednej
   kolejności (tej z legendy danej stylistyki), żeby najechanie na słupek trafiało
   w oczywisty wiersz.

Do tego w makietach wszystkie trzy kafle gotówki mają etykietę „Wolna gotówka" —
zostawione 1:1, choć docelowo to zapewne „wolna / zablokowana / w drodze".

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
