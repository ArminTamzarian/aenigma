import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from 'chai';

import { Aenigma } from '../src/aenigma';

import { Credentials, EncryptedValue } from '../src/aenigma.model';

import { AenigmaStorageService } from '../src/aenigma.service';

import { AenigmaUtil } from '../src/aenigma.util';

const languageSamples: Map<string, string> = new Map([
  ['Anglo-Saxon (Latin)', 'Ic mæg glæs eotan ond hit ne hearmiað me'],
  ['Arabic', 'أنا قادر على أكل الزجاج و هذا لا يؤلمني'],
  ['Armenian', 'Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ'],
  ['Bengali', 'আমি কাঁচ খেতে পারি, তাতে আমার কোনো ক্ষতি হয় না।'],
  ['Chinese', '我能吞下玻璃而不伤身体'],
  ['English', "I can eat glass and it doesn't hurt me"],
  ['English (IPA)', 'aɪ kæn iːt glɑːs ænd ɪt dɐz nɒt hɜːt miː'],
  ['Erzian', 'Мон ярсан суликадо, ды зыян эйстэнзэ а ули'],
  ['French', 'Je peux manger du verre, ça ne me fait pas mal'],
  ['Georgian', 'მინას ვჭამ და არა მტკივა'],
  ['Greek', 'Μπορῶ νὰ φάω σπασμένα γυαλιὰ χωρὶς νὰ πάθω τίποτα'],
  ['Hebrew', 'אני יכול לאכול זכוכית וזה לא מזיק לי'],
  ['Japanese', '私はガラスを食べられます。それは私を傷つけません'],
  ['Korean', '나는 유리를 먹을 수 있어요. 그래도 아프지 않아요'],
  ['Macedonian', 'Можам да јадам стакло, а не ме штета'],
  ['Romanian', 'Pot să mănânc sticlă și ea nu mă rănește'],
  ['Russian', 'Я могу есть стекло, оно мне не вредит'],
  ['Sanskrit', 'काचं शक्नोम्यत्तुम् । नोपहिनस्ति माम् ॥'],
  ['Thai', 'ฉันกินกระจกได้ แต่มันไม่ทำให้ฉันเจ็บ']
]);

describe('AenigmaUtil', () => {
  languageSamples.forEach((value: string, key: string) => {
    it(`AenigmaUtil / arrayBufferToString, stringToArrayBuffer : ${key}`, () => {
      expect(
        AenigmaUtil.arrayBufferToString(AenigmaUtil.stringToArrayBuffer(value))
      ).to.equal(value);
    });
  });
});

describe('Credentials', () => {
  it('Credentials / generate : default generation of credentials', done => {
    Credentials.generate().subscribe(
      credentials => {
        expect(credentials).to.not.be.undefined;
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });

  it('Credentials / generate : invalid generation of credentials', done => {
    Credentials.generate(7).subscribe(
      credentials => {
        done('should have failed');
      },
      error => {
        expect(error).to.not.be.undefined;
        done();
      }
    );
  });

  it('Credentials / generate : valid generation of credentials (128)', done => {
    Credentials.generate(128).subscribe(
      credentials => {
        expect(credentials).to.not.be.undefined;
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });

  it('Credentials / generate : valid generation of credentials (256)', done => {
    Credentials.generate(256).subscribe(
      credentials => {
        expect(credentials).to.not.be.undefined;
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });

  it('Credentials / import : initialized generation of credentials', done => {
    const jwk = {
      alg: 'A256GCM',
      ext: true,
      k: 'zVZm2QlPE87CW_zuT3dikIgBVLp-CuVnHzBy3N9gPvo',
      key_ops: ['encrypt', 'decrypt'],
      kty: 'oct'
    };

    Credentials.import(jwk).subscribe(
      credentials => {
        expect(credentials).to.not.be.undefined;
        expect(credentials.key.k).to.equal(jwk.k);
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });

  it('Credentials / import : invalid initialized generation of credentials (invalid algorithm)', done => {
    const jwk = {
      alg: 'A256XXX',
      ext: true,
      k: 'zVZm2QlPE87CW_zuT3dikIgBVLp-CuVnHzBy3N9gPvo',
      key_ops: ['encrypt', 'decrypt'],
      kty: 'oct'
    };

    Credentials.import(jwk).subscribe(
      credentials => {
        done('Import should have failed.');
      },
      error => {
        done();
      }
    );
  });
});

describe('EncryptedValue', () => {
  it('EncryptedValue / parse : encrypted value parsing', () => {
    const json = {
      data: 'tLc6kFa4vgPJJoxkIK1CIDF4HuHqxTxHSgJ5Xw==',
      iv: 'xs1Nqc9MP0gWLnzj'
    };

    const encrypted = EncryptedValue.parse(JSON.stringify(json));
    expect(encrypted).to.not.be.undefined;

    expect(encrypted.data).to.not.be.undefined;
    expect(AenigmaUtil.arrayBufferToBase64(encrypted.data)).to.equal(json.data);

    expect(encrypted.iv).to.not.be.undefined;
    expect(AenigmaUtil.arrayBufferToBase64(encrypted.iv.buffer)).to.equal(
      json.iv
    );
  });

  it('EncryptedValue / stringify : encrypted value stringify', () => {
    const json = {
      data: 'tLc6kFa4vgPJJoxkIK1CIDF4HuHqxTxHSgJ5Xw==',
      iv: 'xs1Nqc9MP0gWLnzj'
    };

    const encrypted = EncryptedValue.parse(JSON.stringify(json));
    const stringified = encrypted.stringify();

    expect(stringified).to.not.be.undefined;
    expect(stringified).to.equal(JSON.stringify(json));
  });
});

describe('Aenigma', () => {
  let testCredentials: Credentials;

  beforeEach(done => {
    Credentials.generate().subscribe(
      credentials => {
        testCredentials = credentials;
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });

  it('Aenigma : create / default library creation', done => {
    Aenigma.create().subscribe(
      aenigma => {
        expect(aenigma).to.not.be.undefined;
        expect(aenigma.credentials).to.not.be.undefined;
        expect(aenigma.credentials.key).to.not.be.undefined;
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });

  it('Aenigma : create / initialized library creation', done => {
    Aenigma.create(testCredentials).subscribe(
      aenigma => {
        expect(aenigma).to.not.be.undefined;
        expect(aenigma.credentials).to.not.be.undefined;
        expect(aenigma.credentials.key).to.not.be.undefined;
        done();
      },
      error => {
        console.error(error);
        done(error);
      }
    );
  });
});

describe('data encryption', () => {
  let aenigma: Aenigma;

  beforeEach(done => {
    Credentials.generate()
      .mergeMap((credentials: Credentials) => {
        return Aenigma.create(credentials);
      })
      .subscribe(
        (aenigmaObject: Aenigma) => {
          aenigma = aenigmaObject;
          done();
        },
        error => {
          console.error(error);
          done(error);
        }
      );
  });

  languageSamples.forEach((value: string, key: string) => {
    it(key, done => {
      aenigma.encrypt(value).subscribe(
        (encrypted: EncryptedValue) => {
          done();
        },
        error => {
          console.error(error);
          done(error);
        }
      );
    });
  });
});

describe('data decryption', () => {
  let aenigma: Aenigma;

  beforeEach(done => {
    Credentials.generate()
      .mergeMap((credentials: Credentials) => {
        return Aenigma.create(credentials);
      })
      .subscribe(
        (aenigmaObject: Aenigma) => {
          aenigma = aenigmaObject;
          done();
        },
        error => {
          console.error(error);
          done(error);
        }
      );
  });

  languageSamples.forEach((value: string, key: string) => {
    it(key, done => {
      aenigma
        .encrypt(value)
        .mergeMap((encrypted: EncryptedValue) => {
          return aenigma.decrypt(encrypted);
        })
        .subscribe(
          (decrypted: string) => {
            expect(decrypted).to.equal(value);
            done();
          },
          error => {
            console.error(error);
            done(error);
          }
        );
    });
  });
});
