<?php

	// Definizione di un Enum
	enum TipoMessaggio
	{
		case INFO;
		case WARNING;
		case ERROR;

		public function descrizione(): string
		{
			return match($this)
			{
				self::INFO => "Informazione",
				self::WARNING => "Avviso",
				self::ERROR => "Errore",
			};
		}

		/**
		 * Summary of __toString
		 * @throws Exception
		 * @return never
		 * @category Test
		 */
		public function __toString()
		{
			throw new \Exception('Not implemented');
		}

		/**
		 * Summary of __toString
		 * @throws Exception
		 * @return never
		 * @category Test
		 * @deprecated message
		public function __toString_old()
		{
			throw new \Exception('Not implemented');
		}
		*/
	}

	// Funzione globale
	function mostraMessaggio(TipoMessaggio $tipo, string $messaggio) {echo "[" . $tipo->descrizione() . "]: $messaggio\n";}

	// Definizione di un Trait
	trait Logger
	{
		public function log(string $message) {mostraMessaggio(TipoMessaggio::INFO, $message);}
	}

	// Definizione di un Interfaccia
	interface Messaggi
	{
		public function saluto();
	}

	// Definizione di una Classe
	class Esterni implements Messaggi
	{
		use Logger; // Utilizzo del Trait

		/**
		 * Summary of saluto
		 * @return string
		 * @deprec version
		 * @category Test2
		 */
		public function saluto()
		{
			return "Ciao dall'esterno!";
		}

		public function esegui()
		{
			$this->log($this->saluto());

			// Classe interna dentro un metodo - solo io lo trovo profondamente ridicolo?
			class Interna
			{
				public function messaggio()
				{
					return "Questo è un messaggio dalla classe interna!";
				}

				// // Questa mi aspetto Esterni\esegui\Interna.messaggioDettagliato
				/**
				 * Summary of messaggioDettagliato
				 * @param TipoMessaggio $tipo
				 * @return string
				 * @deprecated
				 */
				public function messaggioDettagliato(TipoMessaggio $tipo)
				{
					return "Dettagli: " . $tipo->descrizione();
				}

				// Questa mi aspetto Esterni\esegui\Interna.messaggioDettagliatoCommentoConPercorsoLungo solo che avrà il nome in verde
				/**
				 * Summary of messaggioDettagliatoCommentoConPercorsoLungo
				 * @param TipoMessaggio $tipo
				 * @return string
				 * @deprecated
				 *
				public function messaggioDettagliatoCommentoConPercorsoLungo(TipoMessaggio $tipo)
				{
					return "Dettagli: " . $tipo->descrizione();
				}*/
		}

		$interna = new Interna();
		echo $interna->messaggio() . "\n"; // Output della classe interna
		echo $interna->messaggioDettagliato(TipoMessaggio::WARNING) . "\n";
	}
}

// Utilizzo della classe Esterni
$esterni = new Esterni();
$esterni->esegui();

// Chiamata alla funzione globale
mostraMessaggio(TipoMessaggio::ERROR, "Questo è un messaggio di errore!");


/*
	enum TipoMessaggioCommentato
	{
		case INFO;
		case WARNING;
		case ERROR;

		public function descrizioneCommentato(): string
		{
			return match($this)
			{
				self::INFO => "Informazione",
				self::WARNING => "Avviso",
				self::ERROR => "Errore",
			};
		}

		/**
		 * Summary of __toString
		 * @throws Exception
		 * @return never
		 * @category Test
		 *
		public function __toStringCommentato()
		{
			throw new \Exception('Not implemented');
		}

		/**
		 * Summary of __toStringoldCommentato
		 * @throws Exception
		 * @return never
		 * @category Test
		 * @deprecated message
		public function __toString_oldCommentato()
		{
			throw new \Exception('Not implemented');
		}
		*
	}

	// Funzione globale
	function mostraMessaggioCommentato(TipoMessaggio $tipo, string $messaggio) {echo "[" . $tipo->descrizione() . "]: $messaggio\n";}

	// Definizione di un Trait
	trait LoggerCommentato
	{
		public function logCommentato(string $message) {mostraMessaggio(TipoMessaggio::INFO, $message);}
	}

	// Definizione di un Interfaccia
	interface MessaggiCommentato
	{
		public function salutoCommentato();
	}

	// Definizione di una Classe
	class EsterniCommentato implements MessaggiCommentato
	{
		use LoggerCommentato; // Utilizzo del Trait

		/**
		 * Summary of saluto
		 * @return string
		 * @deprec version
		 * @category Test2
		 *
		public function salutoCommentato()
		{
			return "Ciao dall'esterno!";
		}

		public function eseguiCommentato()
		{
			$this->log($this->salutoCommentato());

			// Classe interna dentro un metodo - solo io lo trovo profondamente ridicolo?
			class InternaCommentato
			{
				public function messaggioCommentato()
				{
					return "Questo è un messaggio dalla classe interna!";
				}

				// Questa mi aspetto Esterni\esegui\Interna.messaggioDettagliatoCommentato ma in verde
				/**
				 * Summary of messaggioDettagliatoCommentato
				 * @param TipoMessaggio $tipo
				 * @return string
				 * @deprecated
				 *
				public function messaggioDettagliatoCommentato(TipoMessaggio $tipo)
				{
					return "Dettagli: " . $tipo->descrizione();
				}
		}

	
	}
}
*/

?>