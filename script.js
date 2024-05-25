document.addEventListener("DOMContentLoaded", () => {
    fetch('sampl.json')
        .then(response => response.json())
        .then(data => {
            const quizData = data.questions;
            let currentLanguage = 'en';
            let currentQuestionIndex = 0;

            const originalQuestionElement = document.getElementById('original-question');
            const questionEditorElement = document.getElementById('question-editor');
            const originalOptionsContainer = document.getElementById('original-options');
            const modifiedOptionsContainer = document.getElementById('modified-options');
            const okButton = document.getElementById('ok-button');
            const languageSelect = document.getElementById('language');
            const prevQuestionButton = document.getElementById('prev-question');
            const nextQuestionButton = document.getElementById('next-question');
            const questionIndexElement = document.getElementById('question-index');

            let questionEditor;

            ClassicEditor
                .create(questionEditorElement, {
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo', 'MathType', 'ChemType'],
                    math: { engine: 'MathType', symbols: { coloneq: ':' } }
                })
                .then(editor => {
                    questionEditor = editor;
                })
                .catch(error => {
                    console.error('Error initializing CKEditor:', error);
                });

            function displayQuestion(index, language) {
                const questionData = quizData[index];
                const questionText = questionData.stem[language];
                originalQuestionElement.innerHTML = questionText;
                questionEditor.setData(questionText);

                originalOptionsContainer.innerHTML = '';
                modifiedOptionsContainer.innerHTML = '';

                questionData.options[language].forEach((option, optionIndex) => {
                    // Original options
                    const originalOptionElement = document.createElement('div');
                    originalOptionElement.className = 'option';
                    originalOptionElement.innerHTML = option;
                    originalOptionsContainer.appendChild(originalOptionElement);

                    // Modified options
                    const modifiedOptionElement = document.createElement('div');
                    modifiedOptionElement.className = 'option editor-container';
                    const optionInput = document.createElement('textarea');
                    optionInput.rows = 1;
                    optionInput.cols = 50;
                    optionInput.value = option;
                    optionInput.className = 'option-input';
                    optionInput.dataset.index = optionIndex;
                    modifiedOptionElement.appendChild(optionInput);
                    modifiedOptionsContainer.appendChild(modifiedOptionElement);

                    ClassicEditor
                        .create(optionInput, {
                            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'undo', 'redo', 'MathType', 'ChemType'],
                            math: { engine: 'MathType', symbols: { coloneq: ':' } }
                        })
                        .then(editor => {
                            editor.model.document.on('change:data', () => {
                                optionInput.value = editor.getData();
                            });
                        })
                        .catch(error => {
                            console.error('Error initializing CKEditor for options:', error);
                        });
                });
                questionIndexElement.textContent = `Question ${index + 1}`;
                MathJax.typeset();
            }

            languageSelect.addEventListener('change', () => {
                currentLanguage = languageSelect.value;
                displayQuestion(currentQuestionIndex, currentLanguage);
            });

            prevQuestionButton.addEventListener('click', () => {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    displayQuestion(currentQuestionIndex, currentLanguage);
                }
            });

            nextQuestionButton.addEventListener('click', () => {
                if (currentQuestionIndex < quizData.length - 1) {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex, currentLanguage);
                }
            });

            okButton.addEventListener('click', () => {
                const modifiedQuestion = questionEditor.getData();
                console.log('Modified Question:', modifiedQuestion);

                const modifiedOptions = [];
                const optionInputs = modifiedOptionsContainer.getElementsByClassName('option-input');
                for (let input of optionInputs) {
                    modifiedOptions.push(input.value);
                }
                console.log('Modified Options:', modifiedOptions);
            });

            displayQuestion(currentQuestionIndex, currentLanguage);
        })
        .catch(error => {
            console.error('Error fetching quiz data:', error);
        });
});
