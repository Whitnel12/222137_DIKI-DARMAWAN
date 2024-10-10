        // Vigenere Cipher implementation
        function vigenereEncrypt(text, key, extended = false) {
            let result = "";
            let keyIndex = 0;

            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                if (!extended && !char.match(/[a-zA-Z]/)) continue;

                let charCode = extended ? text.charCodeAt(i) : text.toUpperCase().charCodeAt(i) - 65;
                let keyChar = key[keyIndex % key.length];
                let keyCode = extended ? keyChar.charCodeAt(0) : keyChar.toUpperCase().charCodeAt(0) - 65;

                if (extended) {
                    result += String.fromCharCode((charCode + keyCode) % 256);
                } else {
                    result += String.fromCharCode(((charCode + keyCode) % 26) + 65);
                }
                keyIndex++;
            }

            return result;
        }

        function vigenereDecrypt(text, key, extended = false) {
            let result = "";
            let keyIndex = 0;

            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                if (!extended && !char.match(/[a-zA-Z]/)) continue;

                let charCode = extended ? text.charCodeAt(i) : text.toUpperCase().charCodeAt(i) - 65;
                let keyChar = key[keyIndex % key.length];
                let keyCode = extended ? keyChar.charCodeAt(0) : keyChar.toUpperCase().charCodeAt(0) - 65;

                if (extended) {
                    result += String.fromCharCode((charCode - keyCode + 256) % 256);
                } else {
                    result += String.fromCharCode(((charCode - keyCode + 26) % 26) + 65);
                }
                keyIndex++;
            }

            return result;
        }

        // Playfair Cipher implementation
        // Playfair Cipher implementation
        function generatePlayfairMatrix(key) {
            let matrix = [];
            let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // Note: I and J are combined
            let usedChars = new Set();

            // First, add the key to the matrix
            for (let char of key.toUpperCase()) {
                if (char === 'J') char = 'I';
                if (!usedChars.has(char) && char.match(/[A-Z]/)) {
                    matrix.push(char);
                    usedChars.add(char);
                }
            }

            // Then add the remaining alphabet
            for (let char of alphabet) {
                if (!usedChars.has(char)) {
                    matrix.push(char);
                    usedChars.add(char);
                }
            }

            return matrix;
        }

        function findPositionInMatrix(matrix, char) {
            const pos = matrix.indexOf(char);
            return {
                row: Math.floor(pos / 5),
                col: pos % 5
            };
        }

        function playfairEncrypt(text, key) {
            const matrix = generatePlayfairMatrix(key);
            text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

            // Persiapkan teks (split menjadi digraf dan tangani huruf ganda)
            let prepared = '';
            for (let i = 0; i < text.length; i++) {
                prepared += text[i];
                if (i + 1 < text.length) {
                    if (text[i] === text[i + 1]) {
                        prepared += 'X';
                    }
                }
            }
            if (prepared.length % 2 !== 0) prepared += 'X';

            // Split menjadi pasangan
            let pairs = [];
            for (let i = 0; i < prepared.length; i += 2) {
                pairs.push(prepared.substr(i, 2));
            }

            // Enkripsi setiap digraf
            let result = "";
            for (let pair of pairs) {
                let pos1 = findPositionInMatrix(matrix, pair[0]);
                let pos2 = findPositionInMatrix(matrix, pair[1]);

                if (pos1.row === pos2.row) {
                    result += matrix[pos1.row * 5 + (pos1.col + 1) % 5];
                    result += matrix[pos2.row * 5 + (pos2.col + 1) % 5];
                } else if (pos1.col === pos2.col) {
                    result += matrix[((pos1.row + 1) % 5) * 5 + pos1.col];
                    result += matrix[((pos2.row + 1) % 5) * 5 + pos2.col];
                } else {
                    result += matrix[pos1.row * 5 + pos2.col];
                    result += matrix[pos2.row * 5 + pos1.col];
                }
            }

            return result;
        }

        function playfairDecrypt(text, key) {
            const matrix = generatePlayfairMatrix(key);
            text = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

            // Split menjadi pasangan
            let pairs = [];
            for (let i = 0; i < text.length; i += 2) {
                if (i + 1 < text.length) {
                    pairs.push(text.substr(i, 2));
                }
            }

            // Dekripsi setiap digraf
            let result = "";
            for (let pair of pairs) {
                let pos1 = findPositionInMatrix(matrix, pair[0]);
                let pos2 = findPositionInMatrix(matrix, pair[1]);

                if (pos1.row === pos2.row) {
                    result += matrix[pos1.row * 5 + (pos1.col - 1 + 5) % 5];
                    result += matrix[pos2.row * 5 + (pos2.col - 1 + 5) % 5];
                } else if (pos1.col === pos2.col) {
                    result += matrix[((pos1.row - 1 + 5) % 5) * 5 + pos1.col];
                    result += matrix[((pos2.row - 1 + 5) % 5) * 5 + pos2.col];
                } else {
                    result += matrix[pos1.row * 5 + pos2.col];
                    result += matrix[pos2.row * 5 + pos1.col];
                }
            }

            // Post-processing: hapus 'X' yang disisipkan
            let finalResult = "";
            for (let i = 0; i < result.length; i++) {
                if (result[i] === 'X') {
                    // Cek apakah X ini adalah sisipan antara huruf ganda
                    if (i > 0 && i < result.length - 1 && result[i - 1] === result[i + 1]) {
                        continue; // Lewati X ini
                    }
                }
                finalResult += result[i];
            }

            // Hapus X di akhir jika ada
            if (finalResult.endsWith('X')) {
                finalResult = finalResult.slice(0, -1);
            }

            return finalResult;
        }

        function demoPlayfair() {
            const testCases = [
                { text: "HELLO", key: "KEYWORD" },
                { text: "HASANUDDIN", key: "KEYWORD" }
            ];

            console.log("Playfair Cipher Demo:");
            for (let test of testCases) {
                console.log(`\nOriginal text: ${ test.text }`);
                console.log(`Key: ${test.key}`);

                const encrypted = playfairEncrypt(test.text, test.key);
                console.log(`Encrypted: ${ encrypted }`);

                const decrypted = playfairDecrypt(encrypted, test.key);
                console.log(`Decrypted: ${ decrypted }`);
            }
        }

        // Tambahkan tombol untuk demo
        function addDemoButton() {
            const container = document.querySelector('.container');
            const demoButton = document.createElement('button');
            demoButton.textContent = 'Run Playfair Demo';
            demoButton.onclick = demoPlayfair;
            container.appendChild(demoButton);
        }

        // Enigma Cipher (Simplified) implementation
        class EnigmaMachine {
            constructor() {
                this.rotors = [
                    'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
                    'AJDKSIRUXBLHWTMCQGZNPYFVOE',
                    'BDFHJLCPRTXVZNYEIWGAKMUSQO'
                ];
                this.reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
                this.rotorPositions = [0, 0, 0];
            }

            rotateRotor(rotor) {
                return rotor.slice(1) + rotor[0];
            }

            encryptLetter(letter) {
                for (let i = 0; i < 3; i++) {
                    const index = letter.charCodeAt(0) - 65;
                    letter = this.rotors[i][index];
                }

                const index = letter.charCodeAt(0) - 65;
                letter = this.reflector[index];

                for (let i = 2; i >= 0; i--) {
                    const index = this.rotors[i].indexOf(letter);
                    letter = String.fromCharCode(65 + index);
                }

                this.rotors[0] = this.rotateRotor(this.rotors[0]);

                return letter;
            }

            encrypt(text) {
                return text.toUpperCase().split('').map(char => {
                    if (/[A-Z]/.test(char)) {
                        return this.encryptLetter(char);
                    }
                    return char;
                }).join('');
            }
        }

        // One-Time Pad Cipher implementation
        function otpEncrypt(text, key) {
            let result = '';
            for (let i = 0; i < text.length; i++) {
                let charCode = text.charCodeAt(i);
                let keyCode = key.charCodeAt(i % key.length);
                result += String.fromCharCode(charCode ^ keyCode);
            }
            return result;
        }

        function otpDecrypt(text, key) {
            return otpEncrypt(text, key);
        }

        function displayPlayfairMatrix(key) {
            const matrix = generatePlayfairMatrix(key);
            let display = "Playfair Matrix:\n";
            for (let i = 0; i < 5; i++) {
                display += matrix.slice(i * 5, (i + 1) * 5).join(' ') + '\n';
            }
            console.log(display);
            return display;
        }

        // UI-related functions
        function displayOutput(result) {
            document.getElementById('outputText').textContent = result;
        }

        function encrypt() {
            const text = document.getElementById('inputText').value;
            const key = document.getElementById('key').value;
            const cipherType = document.getElementById('cipherType').value;
            let result = '';

            switch (cipherType) {
                case 'vigenere':
                    result = vigenereEncrypt(text, key);
                    break;
                case 'extendedVigenere':
                    result = vigenereEncrypt(text, key, true);
                    break;
                case 'playfair':
                    result = playfairEncrypt(text, key);
                    break;
                case 'enigma':
                    const enigma = new EnigmaMachine();
                    result = enigma.encrypt(text);
                    break;
                case 'otp':
                    result = otpEncrypt(text, key);
                    break;
                default:
                    result = 'Invalid cipher selected!';
            }

            displayOutput(result);
        }
        function decrypt() {
            const text = document.getElementById('inputText').value;
            const key = document.getElementById('key').value;
            const cipherType = document.getElementById('cipherType').value;
            let result = '';

            switch (cipherType) {
                case 'vigenere':
                    result = vigenereDecrypt(text, key);
                    break;
                case 'extendedVigenere':
                    result = vigenereDecrypt(text, key, true);
                    break;
                case 'playfair':
                    console.log(displayPlayfairMatrix(key)); // This will help with debugging
                    result = playfairDecrypt(text, key);
                    break;
                case 'enigma':
                    const enigma = new EnigmaMachine();
                    result = enigma.encrypt(text); // Enigma is symmetric
                    break;
                case 'otp':
                    result = otpDecrypt(text, key);
                    break;
                default:
                    result = 'Invalid cipher selected!';
            }

            displayOutput(result);
        }

        // File upload handling
        document.getElementById('fileInput').addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('inputText').value = e.target.result;
            };
            reader.readAsText(file);
        });

        // Download output as file
        function downloadOutput() {
            const text = document.getElementById('outputText').textContent;
            const blob = new Blob([text], { type: 'text/plain' });
            const anchor = document.createElement('a');
            anchor.href = URL.createObjectURL(blob);
            anchor.download = 'output.txt';
            anchor.click();
        }