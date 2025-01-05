// test/testApi.js
const axios = require('axios');
const { api } = require('./api');

async function testApi() {
    console.log('Starting API tests...\n');

    // Test data
    const testData = {
        teamWords: ['FISH', 'WATER', 'BOAT', 'WAVE'],
        otherWords: ['CAR', 'ROAD', 'WHEEL'],
        bystanderWords: ['TREE', 'HOUSE'],
        assassinWord: 'POISON',
        
        clue: 'OCEAN',
        number: 2,
        unguessedWords: ['FISH', 'WATER', 'BOAT', 'CAR', 'TREE']
    };

    // Test getClue with retries
    console.log('Testing getClue with retries...');
    try {
        const clueResult = await api.getClue(
            testData.teamWords,
            testData.otherWords,
            testData.bystanderWords,
            testData.assassinWord,
            { baseUrl: 'http://localhost:3001' }
        );
        console.log('✅ Clue result:', clueResult);
    } catch (error) {
        console.error('❌ getClue test failed:', {
            name: error.name,
            message: error.message,
            status: error.status
        });
    }

    // Test getGuesses
    console.log('\nTesting getGuesses...');
    try {
        const guessesResult = await api.getGuesses(
            testData.clue,
            testData.number,
            testData.unguessedWords,
            { baseUrl: 'http://localhost:3001' }
        );
        console.log('✅ Guesses result:', guessesResult);
    } catch (error) {
        console.error('❌ getGuesses test failed:', {
            name: error.name,
            message: error.message,
            status: error.status
        });
    }

    // Test error handling with invalid URL
    console.log('\nTesting error handling with invalid URL...');
    try {
        await api.getClue(
            testData.teamWords,
            testData.otherWords,
            testData.bystanderWords,
            testData.assassinWord,
            { baseUrl: 'http://localhost:9999' }
        );
        console.error('❌ Error test failed: Expected error but got success');
    } catch (error) {
        console.log('✅ Expected error caught:', {
            name: error.name,
            message: error.message,
            status: error.status
        });
    }

    // Test with explanation flag
    console.log('\nTesting getGuesses with explanation flag...');
    try {
        const guessesWithExplanation = await api.getGuesses(
            testData.clue,
            testData.number,
            testData.unguessedWords,
            { 
                explanation: 1,
                baseUrl: 'http://localhost:3001'
            }
        );
        console.log('✅ Guesses with explanation:', guessesWithExplanation);
    } catch (error) {
        console.error('❌ getGuesses with explanation test failed:', {
            name: error.name,
            message: error.message,
            status: error.status
        });
    }

    // Test with different model
    console.log('\nTesting with different model...');
    try {
        const clueWithDifferentModel = await api.getClue(
            testData.teamWords,
            testData.otherWords,
            testData.bystanderWords,
            testData.assassinWord,
            { 
                model: 'gpt-3.5-turbo',
                baseUrl: 'http://localhost:3001'
            }
        );
        console.log('✅ Clue with different model:', clueWithDifferentModel);
    } catch (error) {
        console.error('❌ Different model test failed:', {
            name: error.name,
            message: error.message,
            status: error.status
        });
    }
}

// Run the tests
if (require.main === module) {
    console.log('Running API tests...\n');
    testApi()
        .then(() => console.log('\nAll tests completed'))
        .catch(error => console.error('\nTest suite failed:', error))
        .finally(() => console.log('\nTest suite finished'));
}