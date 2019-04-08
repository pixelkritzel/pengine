---
title: pw.pixelkritzel.de – Passwörter zum Vergessen
summary: Weil ich eiogentlich immer die gleichen Passwoerter verwendet habe, habe ich mir einen Passwort-Generator geschrieben, der fuer mich rekonstruierbare, sichere Passwoeter erzeugt.
tags:
  - Own Projects
date: 2014-01-02 20:07:57
---

Wer merkt sich gerne Passwörter? Wer tippt gerne Passwörter ein? Und wer hat für jeden Dienst ein individuelles und sicheres Passwort?

Also ich nicht. Und deswegen hatte ich auch ein schlechtes Gewissen. Passwortmanagern traue ich nicht, weniger weil ich befürchte, das sie mich betrügen als eher, dass sie nicht offen sind und ich damit von Software/Dateien abhängig bin, um Inhalte von mir wieder zu erreichen. Und was ist, wenn ich unterwegs mal ein Passwort brauche.

Und wie merkt man sich YjgzOGZlNGQyOTA3M2RmYjY5NjBhNGQy bitte schön?

Ausgerechnet auf Spiegel Online war heute eine brauchbare Lösung zu lesen:

> Es funktioniert so: Ich habe ein relativ sicheres Master-Passwort, nehmen wir der Einfachheit halber &#8216;MASTER&#8217; als Beispiel. Daraus und aus dem Namen des Dienstes, für den ich ein Passwort brauche, bilde ich den SHA1-Hashwert. Diesen Hashwert, zunächst noch in einen Binär-String umgewandelt, konvertiere ich dann mittels Base64 in ein praktisch nutzbares Passwort, das aus den Zeichen a-z sowie A-Z und den Ziffern 0-9 besteht.

Quelle: [http://www.spiegel.de/netzwelt/gadgets/logins-mit-diesen-tricks-behalten-it-experten-ihr-passwort-a-937647.html](http://www.spiegel.de/netzwelt/gadgets/logins-mit-diesen-tricks-behalten-it-experten-ihr-passwort-a-937647.html)

Kurz für alle nicht Techniker erklärt: Ein Hash ist ein sogenannter Falltür-Algorithmus. Ähnlich wie sich bei einer Quersumme auch nicht mehr auf die eigentliche Zahl schließen lässt, so lässt sich bei einem Hash auch nicht mehr das ursprüngliche Passwort erraten. Siehe [Wikipedia: Kryptologische Hashfunktion](http://de.wikipedia.org/wiki/Kryptologische_Hashfunktion).

So kann man aus zwei halbwegs einfach zu merkenden Komponenten wie dem Seitenname und einem geheimen Passwort immer wieder das selbe komplizierte Passwort generieren.

Zum Beispiel aus `pixelkritzel` und `TimosGeheimNachricht` (kann ich mir beides merken) wird: OGZjMWJiOGMxYWJhZTFiMTI1MTg5YTdj

Klingt super, oder? Kurz ausprobiert und das war der kleine Shell-Einzeiler:

    echo -n $1 | shasum -a 1 | base64 | cut -c1-32

Nur das ist immer noch nicht portabel. Daraufhin habe ich eine Implementierung im Browser gebaut:

[http://pw.pixelkritzel.de/](http://pw.pixelkritzel.de/)

Wenn ihr wollt, nutzt es auch gerne.

1.  Geheimes Passwort ausdenken. Vielleicht etwas, das sich auch auf dem Handy tippen lässt.
2.  Servicenamen ausdenken oder einfach den Namen der Internet-Seite nehmen
3.  Und schließlich das Passwort in die Zwischenablage kopieren

**Vorteile:**

* Meine Passwörter sind für mich rekonstruierbar
* Es werden keine Daten irgendwo gespeichert.
* Es funktioniert mit jedem Passwort-Manager, wenn ich wirklich zu faul bin.
* Im HTML lässt sich der komplette Code anschauen, wenn man paranoid ist.

Bei Ideen oder Fragen schreibt [mir](mailto:timo@pixelkritzel.de)
