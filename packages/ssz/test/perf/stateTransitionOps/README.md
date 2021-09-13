# Process block ops

altair.processAttestations: 40-60ms / block

**processAttestation**

Vset_1 = 1/32 of all validators

- Read epochParticipation of Vset_1
- Read effectiveBalances of Vset_1
- Write epochParticipation of Vset_1

# Process epoch ops

altair beforeProcessEpoch 247.20 ms/op
altair processInactivityUpdates 20.222 ms/op
altair processRewardsAndPenalties 131.42 ms/op
altair processEffectiveBalanceUpdates 9.8761 ms/op
altair processParticipationFlagUpdates 162.80 ms/op
altair afterProcessEpoch 192.40 ms/op
