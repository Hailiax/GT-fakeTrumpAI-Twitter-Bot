import json

output = open("trump_response_pairs.txt", "w")

with open('trump_campaign_corpus.json') as json_file:
    data = json.load(json_file)
    for entry in data:
        if entry['genre'] == 'interview' or entry['genre'] == 'town hall':
            if isinstance(entry['doc'], list):
                last_speech = None
                for speech in entry['doc']:
                    if speech['person'] == 'Donald Trump':
                        if last_speech != None and isinstance(speech['p'], str):
                            output.write(last_speech['p'].replace('\r','').replace('\n',''))
                            output.write('\n')
                            output.write(speech['p'].replace('\r','').replace('\n',''))
                            output.write('\n')
                        last_speech = None
                    else:
                        if isinstance(speech['p'], str):
                            last_speech = speech
                        else:
                            last_speech = None

output.close()