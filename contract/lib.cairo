#[abi]
trait ERC20 {
    #[view]
    fn allowance(owner: starknet::ContractAddress, spender: starknet::ContractAddress) -> u256;
    #[external]
    fn transfer(recipient: starknet::ContractAddress, amount: u256) -> bool;
    #[external]
    fn transferFrom(sender: starknet::ContractAddress, recipient: starknet::ContractAddress, amount: u256) -> bool;
    #[external]
    fn approve(spender: starknet::ContractAddress, amount: u256) -> bool;
    #[external]
    fn increaseAllowance(spender: starknet::ContractAddress, added_value: u256) -> bool;
}


#[contract]
mod Disperse {
    use array::ArrayTrait;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use super::ERC20DispatcherTrait;
    use super::ERC20Dispatcher;
    use box::BoxTrait;
    use traits::TryInto;
    use traits::Into;
    use option::OptionTrait;
    
    #[external]
    fn disperse_token(token : ContractAddress, mut addresses : Array<ContractAddress>, mut amounts : Array<felt252>) {
        
        assert( addresses.len() == amounts.len(), 'Error');

        let token_address: ContractAddress = token;
        let disperse_contract = ERC20Dispatcher{ contract_address: token_address};


        
        loop {
            match addresses.pop_front() {
                Option::Some(ad) => {
                    let amt_t: u256 = amounts.pop_front().unwrap().into(); 
                    disperse_contract.transferFrom(get_caller_address(), ad, amt_t);
                },
                Option::None(_) => {
                    break 0;
                },
            };
            
        
        };

    }

}

